 
        google.charts.load('current', {packages: ['corechart']});
        google.charts.load("current", {packages:["calendar"]});
        google.charts.setOnLoadCallback(drawChart);
        google.charts.setOnLoadCallback(drawChart2);
        google.charts.setOnLoadCallback(drawChart3);
        google.charts.setOnLoadCallback(drawChart4);



        
          var msgFromServer;
          $.get( "/analytics-data", function( data ) {
              msgFromServer = data.text;
              alert( "Received data from server!" );
              console.log(msgFromServer);
          });
        

        function drawChart() {
          var num = 0.50;
          var num1 = 0.50;
          // Define the chart to be drawn.
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Gender');
          data.addColumn('number', 'Percentage');
          data.addRows([
            ['Male', num],
            ['Female', num1],
          ]);
    
          // Instantiate and draw the chart.
          var chart = new google.visualization.PieChart(document.getElementById('myPieChart'));
          chart.draw(data, null);
        }


        function drawChart2() {

            var booked = 0.70;
            var remain = 0.30;
          // Define the chart to be drawn.
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Seats');
          data.addColumn('number', 'Percentage');
          data.addRows([
            ['Booked Seats', booked],
            ['Remaining Seats', remain],
          ]);
    
          // Instantiate and draw the chart.
          var chart = new google.visualization.PieChart(document.getElementById('myPieChart2'));
          chart.draw(data, null);
        }



        function drawChart3() {
        var data = google.visualization.arrayToDataTable([
            ["Age", "Number", { role: "style" } ],
            ["0-14 Yrs", 11, "#b87333"],
            ["15-24 Yrs", 22, "silver"],
            ["25-64 Yrs", 78, "gold"],
            ["65+ Yrs", 24, "color: #e5e4e2"]
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

            var options = {
            title: "Age group of attendees",
            width: 600,
            height: 400,
            bar: {groupWidth: "95%"},
            legend: { position: "none" },
            };
            var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
            chart.draw(view, options);
        }




        function drawChart4() {
       var dataTable = new google.visualization.DataTable();
       dataTable.addColumn({ type: 'date', id: 'Date' });
       dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
       dataTable.addRows([
          [ new Date(2020, 3, 13), 37032 ],
          [ new Date(2020, 3, 14), 38024 ],
          [ new Date(2020, 3, 15), 38024 ],
          [ new Date(2020, 3, 16), 38108 ],
          [ new Date(2020, 3, 17), 38229 ],
          // Many rows omitted for brevity.
          [ new Date(2021, 9, 4), 38177 ],
          [ new Date(2021, 9, 5), 38705 ],
          [ new Date(2021, 9, 12), 38210 ],
          [ new Date(2021, 9, 13), 38029 ],
          [ new Date(2021, 9, 19), 38823 ],
          [ new Date(2021, 9, 23), 38345 ],
          [ new Date(2021, 9, 24), 38436 ],
          [ new Date(2021, 9, 30), 38447 ]
        ]);

       var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

       var options = {
         title: "Ticket Sales",
         height: 350,
       };

       chart.draw(dataTable, options);
   }

   const data = getElementById('bookings');

 