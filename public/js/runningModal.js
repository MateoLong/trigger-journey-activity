define(['postmonger'], function (Postmonger) {
    'use strict';

    var connection = new Postmonger.Session();

    $(window).ready(onRender);
    connection.on('initActivityRunningModal', initialize);

    function onRender() {
        connection.trigger('ready');
    }

    function initialize(data) {
        console.log('Initialization Data:', data);
        
        var inArguments = data.arguments.execute.inArguments;
        var uuidArg = inArguments.find(arg => arg.uuid);
        var uuid = uuidArg ? uuidArg.uuid : null;

        console.log('In Arguments:', inArguments);
        console.log('UUID:', uuid);

        if (uuid) {
            fetch(`/activity/${uuid}`)
                .then(response => response.json())
                .then(activityData => {
                    console.log('Activity Data:', activityData);
                    populateTable(activityData);
                })
                .catch(error => console.error('Error fetching activity data:', error));
        } else {
            console.error('UUID not found in inArguments');
        }
    }

    function populateTable(activityData) {
        var tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ContactKey</th>
                        <th>TriggerDate</th>
                        <th>Status</th>
                        <th>Error Log</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${activityData.contact_key}</td>
                        <td>${new Date(activityData.trigger_date).toLocaleDateString()}</td>
                        <td>${activityData.status}</td>
                        <td>${activityData.error_log || ''}</td>
                    </tr>
                </tbody>
            </table>
        `;
        $('#activity-data').html(tableHtml);
    }
});
