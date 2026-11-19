//import { data } from "./data.js";

window.loadData = (json) => {
  const odata = JSON.parse(json);

  convertDate(odata);

  //add index element
  const data = odata.map((e) => Object(e));
  data.forEach(function (row, index) {
    row.index = index;
  });

  let table = new DataTable("#table", {
    data: data,
    paging: false,
    fixedHeader: true,
    scrollCollapse: true,
    scrollY: "450px",
    layout: {
      topStart: {
        buttons: [
          {
            extend: "searchPanes",
            config: {
              cascadePanes: true,
              collapse: false,
            },
          },
        ],
      },
    },
    columns: [
      {
        data: "fieldData.date",
        title: "Date",
      },
      {
        data: "fieldData.orderId",
        title: "Order #",
      },

      {
        data: "fieldData.location",
        title: "Location",
        render: DataTable.render.ellipsis(30),
      },
      {
        data: "fieldData.reason",
        title: "Reason",
        render: DataTable.render.ellipsis(30),
      },
      {
        data: "fieldData.type",
        title: "Type",
      },
      {
        data: "fieldData.issueType",
        title: "Issue Type",
      },
      {
        data: "fieldData.mp",
        title: "MP",
      }
    ],
    columnDefs: [
      {
        searchPanes: {
          show: true,
        },
        targets: [1, 2],
      },
      {
        searchPanes: {
          show: false,
        },
        targets: [0, 3],
      },
    ],
  });


  window.callFM = function (result) {
    FileMaker.PerformScript("USR_U003 -  wv_runScript", JSON.stringify(result));
  };

  $(".dataTable").on("click", "tbody tr", function () {
    let build = {
      data: table.row(this).data(),
      table: "remake",
    };
    callFM(build);
  });



    function convertDate(data) {
      // Loop through each object in the array
      data.forEach((item) => {
        // Extract the Ship_Date from fieldData
        let date = item.fieldData.date;
        if (date) {
          // Split the date by '/'
          let parts = date.split("/");
  
          // Extract month, day, and year
          let month = parts[0];
          let day = parts[1];
          let year = parts[2];
  
          // Extract last two digits of the year
          let shortYear = year.slice(-2);
  
          // Construct MM/DD/YY format
          let newDate = `${month}/${day}/${shortYear}`;
  
          // Update the fieldData with the new format
          item.fieldData.date = newDate;
        }});
  
    return data;
  }
};
