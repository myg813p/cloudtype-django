function showDate() {
  //Calculate DATE
  //Calculate DATE
  //Calculate DATE
  //Calculate DATE
  //Calculate DATE
  //Calculate DATE
  let text = "2024-04";
  let startDate = new Date(text);
  let endDate = new Date("2024-01");
  let monthsList = [];

  while (startDate >= endDate) {
    let month = startDate.getMonth() + 1; // Adding 1 because months are zero-based
    let formattedMonth = month < 10 ? `0${month}` : `${month}`;
    let year = startDate.getFullYear();
    monthsList.push(`${year}-${formattedMonth}`);
    startDate.setMonth(startDate.getMonth() - 1);
  }
  // console.log(monthsList);

  return monthsList;
}

const getUserData = async () => {
  try {
    // Get the current URL
    var currentUrl = window.location.href;

    // Log or use the URL as needed
    console.log("Current URL:", currentUrl);

    const accessToken = localStorage.getItem("access");
    const response = await fetch(`/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await response.json();
    localStorage.setItem("biz_owner", userData.biz_owner);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("cust_nm", userData.cust_nm);
    localStorage.setItem("biz_no", userData.biz_no);

    document.getElementById(
      "username"
    ).textContent = `${userData.biz_owner}님 (${userData.username})`;
    document.getElementById(
      "userinfo"
    ).textContent = `${userData.cust_nm} [${userData.biz_no}]`;

    //어드민, 유저 공통
    //판촉내역, 광고내역
    monthsList = showDate();
    // Get the dropdown container element
    var dropdownContainer_prom = document.getElementById(
      "month_select_prom_dropdown"
    );
    var dropdownContainer_ads = document.getElementById(
      "month_select_ads_dropdown"
    );

    //del children
    var div = document.getElementById("month_select_prom_dropdown");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    for (var i = 0; i < monthsList.length; i++) {
      // Create a new monthItem for prom dropdown
      var monthItem_prom = document.createElement("a");
      monthItem_prom.setAttribute("class", "dropdown-item");
      monthItem_prom.setAttribute("href", "#");
      if (userData.username === "admin") {
        monthItem_prom.setAttribute(
          "onclick",
          `adminStart('${monthsList[i]}')`
        );
      } else if (userData.username !== "admin") {
        monthItem_prom.setAttribute(
          "onclick",
          `othersStart('${userData.biz_no}', ['${monthsList[i]}selected_prom'])`
        );
      }
      monthItem_prom.textContent = monthsList[i];

      // Append the created item to the prom dropdown container
      dropdownContainer_prom.appendChild(monthItem_prom);

      // Create a new monthItem for ads dropdown
      var monthItem_ads = document.createElement("a");
      monthItem_ads.setAttribute("class", "dropdown-item");
      monthItem_ads.setAttribute("href", "#");
      monthItem_ads.setAttribute(
        "onclick",
        `othersStart('${userData.biz_no}', ['${monthsList[i]}selected_ads'])`
      );
      monthItem_ads.textContent = monthsList[i];

      // Append the created item to the ads dropdown container
      if (i > 0) {
        dropdownContainer_ads.appendChild(monthItem_ads);
      }
    }

    if (userData.username === "admin") {
      monthLists = showDate();
      selectedDate = monthLists[0];
      console.log(selectedDate);
      adminStart(selectedDate);
    } else {
      othersStart(userData.biz_no, monthsList);
    }

    return userData.username; // Return the username
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error or display a message to the user
    return null; // Return null or handle error accordingly
  }
};

//어드민
//어드민
//어드민
//어드민
//어드민
function adminStart(selectedDate) {
  var card1_name = document.getElementById("card1_name");
  page_name = localStorage.getItem("adminBtn");
  if (!page_name) {
    page_name = "세부내역";
  }
  card1_name.innerText = page_name + " (" + selectedDate + ")";

  console.log(localStorage.getItem("adminBtn"));
  // 광고내역 hidden
  var dropdownContainer_ads = document.getElementById("month_select_ads");
  dropdownContainer_ads.style.display = "none";

  //
  document.getElementById("card1_name").textContent = "어드민";
  document.getElementById("userinfo").textContent = "ADMIN";
  document.getElementById("username").textContent = "어드민";
  // console.log(localStorage.adminBtn);

  if (
    localStorage.adminBtn === "세부내역" ||
    localStorage.adminBtn === undefined
  ) {
    url = "/api/AdminData/";
  } else if (localStorage.adminBtn === "세부내역2") {
    // url = "/api/AdminData0/";
    var url = "/static/ai_front/json_files/data_detail2/data_reports2.zip";
    var a = document.createElement("a");
    a.download = "data_reports2.zip";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
  } else {
    url = "/api/AdminData/";
  }
  const data = {
    token: localStorage.getItem("access"),
    username: localStorage.getItem("username"),
    selectedDate: selectedDate,
  };
  // console.log(url);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      adminData(data["adminData"], url, selectedDate);
    })
    .catch((error) => console.error("Error:", error));
}

function adminData(data, url, selectedDate) {
  var card1_name = document.getElementById("card1_name");
  page_name = localStorage.getItem("adminBtn");
  if (!page_name) {
    page_name = "세부내역";
  }
  card1_name.innerText = page_name + " (" + selectedDate + ")";

  // Remove all child elements
  var parentElement = document.getElementById("prom_table");
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }

  if (data) {
    //container
    var containerDiv = document.createElement("div");
    containerDiv.className = "container mt-4";
    var tableContainerDiv = document.createElement("div");
    tableContainerDiv.id = "tableContainer";
    containerDiv.appendChild(tableContainerDiv);
    var bodyElement = document.getElementById("prom_table");
    bodyElement.appendChild(containerDiv);
    // Check if the screen width is below a certain threshold (e.g., 768px for typical mobile devices)
    if (window.innerWidth <= 768) {
      tableContainerDiv.className = "table-responsive";
    }

    var table = document.createElement("table");
    table.classList.add(
      "table",
      "table-bordered",
      "table-hover",
      "jsonData2",
      "mt-4"
    );

    // Create the table header
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach((key) => {
      var th = document.createElement("th");
      th.textContent = key;

      console.log(key);

      if (key === "calendar") {
        th.style.setProperty("min-width", "120px");
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    var tbody = document.createElement("tbody");
    data.forEach((item, rowIndex) => {
      var row = document.createElement("tr");

      Object.entries(item).forEach(([key, value], colIndex) => {
        var td = document.createElement("td");
        // console.log(key)

        // Check if it's the first td and create an input box
        if (
          key === "remark" &&
          (localStorage.adminBtn === "세부내역" ||
            localStorage.adminBtn === undefined)
        ) {
          var select = document.createElement("select");
          select.classList.add(
            "form-select",
            "form-select-sm",
            "btn-outline-secondary",
            "w-auto"
          );
          select.id = `row_${rowIndex}_${colIndex}`;

          //ABC
          var options = [" ", "체크", "폐점", "양도양수"];
          for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            option.value = options[i];
            option.text = options[i];
            select.appendChild(option);
          }

          // Set the selected option based on the current value
          if (value !== null) {
            temp_save_remark_value = value;
            select.value = temp_save_remark_value;
            if (temp_save_remark_value === "체크") {
              row.classList.add("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-primary");
              row.classList.remove("table-dark");
            } else if (temp_save_remark_value === "폐점") {
              row.classList.add("table-dark");
              row.classList.remove("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-primary");
            } else if (temp_save_remark_value === "양도양수") {
              row.classList.add("table-primary");
              row.classList.remove("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-dark");
            } else {
              row.classList.remove("table-dark");
              row.classList.remove("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-primary");
            }
          }

          // Add change event listener
          select.addEventListener("change", function () {
            var selectedValue = select.value;
            if (selectedValue === "체크") {
              row.classList.add("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-primary");
              row.classList.remove("table-dark");
            } else if (selectedValue === "폐점") {
              row.classList.add("table-dark");
              row.classList.remove("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-primary");
            } else if (selectedValue === "양도양수") {
              row.classList.add("table-primary");
              row.classList.remove("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-dark");
            } else {
              row.classList.remove("table-dark");
              row.classList.remove("table-success");
              row.classList.remove("table-danger");
              row.classList.remove("table-primary");
            }

            // console.log(`row_${rowIndex}_1`);
            change_calendar = document.getElementById(`row_${rowIndex}_1`);
            if (selectedValue == "양도양수") {
              change_calendar.style.display = "block";
            } else {
              change_calendar.style.display = "none";
            }
            remarkSave(rowIndex, selectedValue);

            btn_yang = document.getElementById(`row_${rowIndex}`);
            if (selectedValue == "양도양수") {
              if (!btn_yang) {
                var parentElement = change_calendar.parentNode;
                btn_yang = document.createElement("button");
                btn_yang.id = `row_${rowIndex}`;
                btn_yang.name = `btn_yang`;
                btn_yang.textContent = "양도양수다운로드";
                btn_yang.setAttribute(
                  "onclick",
                  `download_yang('row_${rowIndex}')`
                );
                btn_yang.classList.add("btn", "btn-sm", "btn-danger");
                parentElement.appendChild(btn_yang);
              }
              btn_yang.style.display = "block";
            } else {
              btn_yang.style.display = "none";
            }
          });

          td.appendChild(select);
        } else if (
          key === "calendar" &&
          (localStorage.adminBtn === "세부내역" ||
            localStorage.adminBtn === undefined)
        ) {
          //calendar
          const inputElement = document.createElement("input");
          inputElement.id = `row_${rowIndex}_${colIndex}`;
          inputElement.textContent = value === null ? "null" : value;
          inputElement.classList.add(
            "form-control",
            "form-control-sm",
            "datepicker-input"
          );
          if (temp_save_remark_value != "양도양수") {
            inputElement.style.display = "none";
          } else {
            btn_yang = document.createElement("button");
            btn_yang.id = `row_${rowIndex}`;
            btn_yang.name = `btn_yang`;
            btn_yang.textContent = "양도양수다운로드";
            btn_yang.setAttribute(
              "onclick",
              `download_yang('row_${rowIndex}')`
            );
            btn_yang.classList.add("btn", "btn-sm", "btn-primary");
            td.appendChild(btn_yang);
          }
          if (value !== null) {
            inputElement.value = value;
          }
          td.appendChild(inputElement);
          // Initialize the datepicker after appending the input to the DOM
          $(inputElement).datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            language: "ko",
            clearBtn: true,
            todayHighlight: true,
          });

          // Add event listener for the date change
          $(document).on("changeDate", `#${inputElement.id}`, function (e) {
            var selectedDate = e.format("yyyy-mm-dd");
            remarkSave(rowIndex, selectedDate);
          });
        } else {
          // If value is null, add a class for yellow background
          if (
            (value === null || value === "숨김") &&
            temp_save_remark_value !== "양도양수" &&
            temp_save_remark_value !== "폐점" &&
            temp_save_remark_value !== "체크"
          ) {
            row.classList.add("table-danger");
          }
          td.id = `row_${rowIndex}_${colIndex}`;

          if (
            key === "금액" ||
            key === "쿠폰건수" ||
            key === "합계" ||
            key === "총건수" ||
            key === "총금액" ||
            key === "건수" ||
            key === "총합계"
          ) {
            td.textContent =
              value === null
                ? "null"
                : value === "-"
                ? "-"
                : Number(value).toLocaleString();
            td.style.textAlign = "right";
          } else {
            td.textContent = value === null ? "null" : value;
          }

          // Check if it's the second column (index 1) and create a hyperlink
          if (
            key === "사업자번호" &&
            (localStorage.adminBtn === "세부내역" ||
              localStorage.adminBtn === undefined)
          ) {
            var link = document.createElement("a");
            monthsList = showDate();
            // console.log(monthsList);
            link.setAttribute(
              "onclick",
              `othersStart('${value}', ${JSON.stringify(monthsList)})`
            );
            link.textContent = value;
            link.style.color = "blue";
            link.style.cursor = "pointer";
            td.innerHTML = ""; // Clear td content
            td.appendChild(link);
          }
        }

        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to the container
    tableContainerDiv.appendChild(table);
  }
}

//고객정보
//고객정보
//고객정보
//고객정보
//고객정보
function othersStart(biz_no, monthsList) {
  //어드민페이지
  if (localStorage.username === "admin") {
    const body = document.getElementById("modal_body_ea");
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }

    document.getElementById("modal_store_name").textContent = biz_no;

    // Show the modal
    const myModal = new bootstrap.Modal(
      document.getElementById("userInfoModal")
    );
    myModal.show();
  }
  //어드민 아니면 (점주), 페이지 지우기
  else {
    var promTable = document.getElementById("prom_table");
    while (promTable.firstChild) {
      promTable.removeChild(promTable.firstChild);
    }
  }

  var url0 = `/static/ai_front/json_files/data_fee/cal_due_data.json`;
  var url1 = `/static/ai_front/json_files/data/${biz_no}_baedal.json`;
  var url2 = `/static/ai_front/json_files/data/${biz_no}_coupang.json`;
  var url3 = `/static/ai_front/json_files/data_ads/ads.json`;

  // Use Promise.all to fetch data from both URLs concurrently
  Promise.all([
    fetchData(url0),
    fetchData(url1),
    fetchData(url2),
    fetchData(url3),
  ])
    .then((results) => {
      // results is an array containing the data from both URLs
      const brandSum = [];
      const dataFromUrl0 = results[0];
      const dataFromUrl1 = results[1];
      const dataFromUrl2 = results[2];
      const dataFromUrl3 = results[3];

      // 과금1차, 과금2차 기간 가져오기
      find_fee_month = monthsList[0]
        .replaceAll("-", "")
        .replaceAll("selected_prom", "")
        .replaceAll("selected_ads", "");

      if (dataFromUrl0.hasOwnProperty(find_fee_month)) {
        var fee_month = dataFromUrl0[find_fee_month];
        console.log(fee_month);
      }

      // Do something with the JSON data from both URLs
      // console.log("baedal:", dataFromUrl1);
      // console.log("coupang:", dataFromUrl2);
      // console.log("ads:", dataFromUrl3)

      //container
      var containerDiv = document.createElement("div");
      containerDiv.className = "container mt-4";
      var tableContainerDiv = document.createElement("div");
      tableContainerDiv.id = "tableContainer";
      tableContainerDiv.className = "table-responsive";
      containerDiv.appendChild(tableContainerDiv);
      var bodyElement = document.getElementById("prom_table");
      bodyElement.appendChild(containerDiv);

      //점주 전체표시
      document.getElementById("card1_name").textContent = "과금 내역";
      if (!monthsList[0].includes("selected")) {
        //날짜계산
        jsonToTable_month = monthsList[0];
        if (monthsList[1]) {
          jsonToTableAds_month = monthsList[1];
        } else {
          jsonToTableAds_month = "9999-99";
        }

        if (dataFromUrl1 != undefined) {
          //브랜드명 가져오기
          brandSum.push(...new Set(dataFromUrl1.map((item) => item.브랜드)));
          jsonToTable(dataFromUrl1, "baedal", jsonToTable_month, fee_month);
        }
        if (dataFromUrl2 != undefined) {
          //브랜드명 가져오기
          brandSum.push(...new Set(dataFromUrl2.map((item) => item.브랜드)));
          jsonToTable(dataFromUrl2, "coupang", jsonToTable_month, fee_month);
        }
        if (dataFromUrl3 != undefined) {
          brandCheck = [...new Set(brandSum)];
          jsonToTableAds(dataFromUrl3, brandCheck, jsonToTableAds_month);
        }
      }
      //판촉내역 클릭
      else if (monthsList[0].includes("selected_prom")) {
        jsonToTable_month = monthsList[0].replaceAll("selected_prom", "");
        if (dataFromUrl1 != undefined) {
          //브랜드명 가져오기
          brandSum.push(...new Set(dataFromUrl1.map((item) => item.브랜드)));
          jsonToTable(dataFromUrl1, "baedal", jsonToTable_month, fee_month);
        }
        if (dataFromUrl2 != undefined) {
          //브랜드명 가져오기
          brandSum.push(...new Set(dataFromUrl2.map((item) => item.브랜드)));
          jsonToTable(dataFromUrl2, "coupang", jsonToTable_month, fee_month);
        }
      }
      //광고내역 클릭
      else if (monthsList[0].includes("selected_ads")) {
        jsonToTableAds_month = monthsList[0].replaceAll("selected_ads", "");
        if (dataFromUrl3 != undefined) {
          brandSum.push(...new Set(dataFromUrl1.map((item) => item.브랜드)));
          brandSum.push(...new Set(dataFromUrl2.map((item) => item.브랜드)));
          brandCheck = [...new Set(brandSum)];
          jsonToTableAds(dataFromUrl3, brandCheck, jsonToTableAds_month);
        }
      }
    })
    .catch((error) => {
      console.error(
        "Error fetching data from one or more URLs:",
        error.message
      );
    });
}

// Function to fetch data from a given URL
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching JSON file. Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Error fetching data from ${url}:`, error.message);
    });
}

function remarkSave(rowIndex, selectedValue) {
  // Get data from the HTML elements
  const remark = selectedValue; // 체크,폐점,양도양수,날짜
  const calendar = document.getElementById(`row_${rowIndex}_` + "1")
    .textContent;
  const YM = document.getElementById(`row_${rowIndex}_` + "2").textContent;
  const use_not = document.getElementById(`row_${rowIndex}_` + "3").textContent;
  const rawNo = document.getElementById(`row_${rowIndex}_` + "4").textContent;
  const armNo = document.getElementById(`row_${rowIndex}_` + "5").textContent;

  // Make an API call
  fetch("/api/SaveRemark/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: localStorage.access, // Pass the access token as "token"
      username: localStorage.username,
      rawNo: rawNo,
      armNo: armNo,
      YM: YM,
      remarkText: remark,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.res == "saved") {
        // window.location.reload();
        console.log("saved");
      }
      // Handle the response data as needed
    })
    .catch((error) => {
      console.error("API error:", error);
      // Handle errors
    });
}

function jsonToTable(jsonData, filename, jsonToTable_month, fee_month) {
  check_202311 = false;

  // Create and append the title element
  var titleElement = createTitle(filename);

  if (localStorage.username === "admin") {
    var tableContainer = document.getElementById("modal_body_ea");
  } else {
    var tableContainer = document.getElementById("tableContainer");
  }

  tableContainer.appendChild(titleElement);

  var table = document.createElement("table");
  table.classList.add(
    "table",
    "table-striped",
    "table-bordered",
    "table-hover",
    "jsonData2",
    "mt-4"
  );

  // Create table header
  var header = document.createElement("thead");
  var headerRow = document.createElement("tr");
  for (var key in jsonData[0]) {
    // if (key !== "사업자번호" && !key.includes("과금")) {
    if (key !== "사업자번호") {
      var th = document.createElement("th");
      th.textContent = key;

      if (["년월", "브랜드", "행사"].includes(key)) {
        th.style.textAlign = "left";
      } else {
        if (key.includes("과금") && !key.includes("차")) {
          pay_coupang = `과금${fee_month["first_month"]}`;
          th.textContent = pay_coupang;
        } else if (key.includes("과금1차")) {
          pay_first = `과금1차${fee_month["first_month"]}`;
          th.textContent = pay_first;
        } else if (key.includes("과금2차")) {
          pay_second = `과금2차${fee_month["second_month"]}`;
          th.textContent = pay_second;
        }
        th.style.textAlign = "right";
      }
      headerRow.appendChild(th);
    }
  }
  header.appendChild(headerRow);
  table.appendChild(header);

  // Create table body
  var tbody = document.createElement("tbody");
  for (var i = 0; i < jsonData.length; i++) {
    var row = document.createElement("tr");
    if (jsonData[i]["년월"] === jsonToTable_month.replaceAll("-", "")) {
      for (var key in jsonData[i]) {
        // if (key !== "사업자번호" && !key.includes("과금")) {
        if (key !== "사업자번호") {
          var cell = document.createElement("td");
          // Format the number with commas if it's a digit
          var cellContent = jsonData[i][key];
          if (key == "년월") {
            // Convert the number to a string
            const dateString = cellContent.toString();
            const year = dateString.slice(0, 4);
            const month = dateString.slice(4, 6);
            cellContent = `${year}-${month}`;

            if (dateString == "202311") {
              check_202311 = true;
            }
          } else if (!isNaN(cellContent)) {
            cellContent = formatNumberWithCommas(cellContent);
            cell.style.textAlign = "right";
          }
          if (key == "쿠폰" || key == "분담금") {
            cell.style.textAlign = "right";
          }

          cell.textContent = cellContent;
          row.appendChild(cell);
        }
      }
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Add the sum row
  var sumRow = document.createElement("tr");
  sumRow.classList.add("sum-row", "table-danger");
  sumRow.style.fontWeight = "bold";

  var sumLabels = ["년월", "브랜드", "행사", "쿠폰", "분담금"];
  for (var i = 0; i < sumLabels.length; i++) {
    var sumCell = document.createElement("td");
    if (i == 0) {
      sumCell.textContent = "합계";
    }
    sumRow.appendChild(sumCell);
  }

  if (filename.includes("baedal")) {
    // var sumColumns = ["건수", "총합계", `${pay_first}`, `${pay_second}`];
    var sumColumns = ["건수", "총합계", "과금1차", "과금2차"];
    // var sumColumns = ["건수", "총합계"];
  } else if (filename.includes("coupang")) {
    // var sumColumns = ["건수", "총합계", `${pay_coupang}`];
    var sumColumns = ["건수", "총합계", "과금"];
    // var sumColumns = ["건수", "총합계"];
  }
  for (var i = 0; i < sumColumns.length; i++) {
    var sumCell = document.createElement("td");
    //쿠팡 총합계 표시 안함

    if (filename.includes("coupang") && sumColumns[i] == "총합계") {
      // if (filename.includes("coupang") && sumColumns[i] == "총합계ㄴ") {

      sumCell.textContent = "";
    } else {
      temp_text = String(
        formatNumberWithCommas(
          Math.round(calculateSum(jsonData, sumColumns[i], jsonToTable_month))
        )
      );
      if (sumColumns[i] == "건수") {
        sumCell.textContent = temp_text + "건";
      } else {
        sumCell.textContent = temp_text + "원";
      }
    }
    sumCell.style.textAlign = "right";
    sumRow.appendChild(sumCell);
  }

  tbody.appendChild(sumRow);
  tableContainer.appendChild(table);

  // footer note
  var disclaimerDiv = document.createElement("div");
  disclaimerDiv.style.fontSize = "11px";
  disclaimerDiv.style.color = "red";
  disclaimerDiv.style.textAlign = "right";
  disclaimerDiv.textContent =
    "* 플랫폼사에서 제공하는 정산 내역에 따라 내용이 변경될 수 있습니다.";
  tableContainer.appendChild(disclaimerDiv);

  // footer note except for 202311
  if (check_202311 == true) {
    var disclaimerDiv_ex = document.createElement("div");
    disclaimerDiv_ex.style.fontSize = "11px";
    disclaimerDiv_ex.style.color = "red";
    disclaimerDiv_ex.style.textAlign = "right";
    disclaimerDiv_ex.textContent =
      "* 배민측으로부터 받은 자료 중 11월 1일~5일까지 기획전 내역이 누락되어 12월 정산 내역에 추가되었습니다.";
    tableContainer.appendChild(disclaimerDiv_ex);
  }

  //br tag
  if (filename.includes("baedal")) {
    br_cnt = 4;
  } else if (filename.includes("coupang")) {
    br_cnt = 6;
  }

  for (let i = 0; i < br_cnt; i++) {
    const lineBreak = document.createElement("br");
    tableContainer.appendChild(lineBreak);
  }
}

function jsonToTableAds(jsonData, brandCheck, jsonToTableAds_month) {
  // console.log(jsonData)
  // console.log(brandCheck)
  // console.log(Object.keys(jsonData).length);

  for (let i = 0; i < brandCheck.length; i++) {
    for (let j = 0; j < Object.keys(jsonData).length; j++) {
      if (brandCheck[i] === Object.keys(jsonData)[j]) {
        // console.log(brandCheck[i]);

        ads_sum = 0;
        ads_store = 0;
        ads_compy = 0;

        const matchedValue = jsonData[Object.keys(jsonData)[j]];

        //make table // similar with jsonToTable
        //make table // similar with jsonToTable
        //make table // similar with jsonToTable

        // Create and append the title element
        var titleElement = createTitle(brandCheck[i]);

        if (localStorage.username === "admin") {
          var tableContainer = document.getElementById("modal_body_ea");
        } else {
          var tableContainer = document.getElementById("tableContainer");
        }

        var table = document.createElement("table");
        table.classList.add(
          "table",
          "table-striped",
          "table-bordered",
          "table-hover",
          "jsonData3",
          "mt-4"
        );

        // Create table header
        var header = document.createElement("thead");
        var headerRow = document.createElement("tr");
        matchedValue[0].forEach((headerText, index) => {
          if (index !== matchedValue[0].length - 1) {
            var th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
            if (index > 1) {
              th.style.textAlign = "right";
            }
          }
        });
        header.appendChild(headerRow);
        table.appendChild(header);

        // Create table body
        var tbody = document.createElement("tbody");
        for (let i = 2; i < matchedValue.length; i++) {
          // console.log(typeof(jsonToTableAds_month))
          // console.log(jsonToTableAds_month)
          // console.log(matchedValue)
          if (matchedValue[i][0] == jsonToTableAds_month.replaceAll("-", "")) {
            var row = document.createElement("tr");
            matchedValue[i].forEach((cellText, index) => {
              // console.log(matchedValue[i])
              if (index !== matchedValue[0].length - 1) {
                var td = document.createElement("td");
                td.textContent = cellText;
                // You can now use the 'index' variable here as needed
                row.appendChild(td);
                if (index > 1) {
                  td.style.textAlign = "right";
                  if (index === 3) {
                    ads_sum += Number(cellText.replaceAll(",", ""));
                  } else if (index === 4) {
                    ads_store += Number(cellText.replaceAll(",", ""));
                  } else if (index === 5) {
                    ads_compy += Number(cellText.replaceAll(",", ""));
                  }
                }
              }
            });
          }

          // 광고내역 합계
          if (i === matchedValue.length - 1) {
            var row = document.createElement("tr");
            row.classList.add("sum-row", "table-danger");
            row.style.fontWeight = "bold";
            sum_list = [
              "합계",
              "",
              "",
              "",
              String(ads_sum.toLocaleString()),
              String(ads_store.toLocaleString()),
              String(ads_compy.toLocaleString()),
            ];
            sum_list.forEach((cellText, index) => {
              if (index !== sum_list[0].length - 1) {
                var td = document.createElement("td");
                td.textContent = cellText;
                // You can now use the 'index' variable here as needed
                row.appendChild(td);
                if (index > 1) {
                  td.style.textAlign = "right";
                }
              }
            });
          }
          if (row) {
          tbody.appendChild(row);
          }
        }
        if (row) {
          tableContainer.appendChild(titleElement);
        }

        // console.log(ads_sum)
        // console.log(ads_store)
        // console.log(ads_compy)

        table.appendChild(tbody);
        tableContainer.appendChild(table);
      }
    }
  }
}

// Function to calculate the sum for a specific column
function calculateSum(data, column, jsonToTable_month) {
  var sum = 0;
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    if (data[i]["년월"] == jsonToTable_month.replaceAll("-", "")) {
      sum += parseFloat(data[i][column]) || 0;
    }
  }
  return sum;
}

function createTitle(filename) {
  var titleElement = document.createElement("h3");
  titleElement.id = "title";
  titleElement.classList.add("text-center", "mt-4");
  titleElement.style.marginBottom = "20px";
  titleElement.style.fontWeight = "bold";
  if (filename.includes("baedal")) {
    titleElement.textContent = "[판촉내역] 배달의민족";
    titleElement.style.color = "blue";
  } else if (filename.includes("coupang")) {
    titleElement.textContent = "[판촉내역] 쿠팡이츠";
    titleElement.style.color = "blue";
  } else {
    titleElement.textContent = "[광고내역] " + filename;
    titleElement.style.color = "red";
  }
  return titleElement;
}

// Function to format a number with commas every three digits
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function adminTotal(selectedDate) {
  console.log(selectedDate);
  console.log(localStorage.getItem("adminBtn"));

  url = "/api/AdminTotal/";
  const data = {
    token: localStorage.getItem("access"),
    username: localStorage.getItem("username"),
    selectedDate: selectedDate,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      adminData(data["adminData"], url, selectedDate);
    })
    .catch((error) => console.error("Error:", error));
}

//어드민 스타트 함수
document.addEventListener("DOMContentLoaded", async function () {
  start_function();
});

async function start_function() {
  const username_check = await getUserData();

  if (username_check === "admin") {
    var reloadBtn = document.getElementById("reloadBtn");
    reloadBtn.style.display = "none";

    // Function to create a button
    function createButton(id, text, btnClr) {
      var button = document.createElement("button");
      button.id = id;
      button.className = `btn btn-${btnClr} btn-sm mr-1`;
      button.type = "button";
      button.textContent = text;
      return button;
    }

    // Append buttons to the ul element
    var adminMenu = document.getElementById("admin_menu");

    var button1 = createButton("admin_btn1", "총금액", "primary");
    button1.addEventListener("click", function () {
      console.log("총금액 버튼 테스트");
      document.getElementById("monthDropdown").removeAttribute("hidden");
      //판촉내역, 광고내역
      monthsList = showDate();
      // Get the dropdown container element
      var dropdownContainer_prom = document.getElementById(
        "month_select_prom_dropdown"
      );
      //del children
      var div = document.getElementById("month_select_prom_dropdown");
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
      for (var i = 0; i < monthsList.length; i++) {
        // Create a new monthItem for prom dropdown
        var monthItem_prom = document.createElement("a");
        monthItem_prom.setAttribute("class", "dropdown-item");
        monthItem_prom.setAttribute("href", "#");
        monthItem_prom.setAttribute(
          "onclick",
          `adminTotal('${monthsList[i]}')`
        );
        monthItem_prom.textContent = monthsList[i];

        // Append the created item to the prom dropdown container
        dropdownContainer_prom.appendChild(monthItem_prom);
      }

      localStorage.setItem("adminBtn", "총금액");
      // Handle click for 총금액 button
      const body = document.getElementById("prom_table");
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      monthsList = showDate();
      selectedDate = monthsList[0];
      adminTotal(selectedDate);
    });
    adminMenu.appendChild(button1);

    var button2 = createButton("admin_btn2", "세부내역", "primary");
    button2.addEventListener("click", function () {
      console.log("세부내역 버튼 테스트");
      document.getElementById("monthDropdown").removeAttribute("hidden");
      localStorage.setItem("adminBtn", "세부내역");
      // Handle click for 세부내역 button
      const body = document.getElementById("prom_table");
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      getUserData();
    });
    adminMenu.appendChild(button2);

    //button
    var btnList = [
      "배민(진행내역)",
      "배민(정산내역)",
      "쿠팡(정산내역)",
      "요기요(정산내역)",
      "땡겨요(정산내역)",
    ];
    for (var i = 0; i < btnList.length; i++) {
      (function (index) {
        var button = createButton(
          "admin_btn" + (index + 3),
          btnList[index],
          "dark"
        );
        button.addEventListener("click", function () {
          console.log(btnList[index] + " 버튼 테스트");
          document
            .getElementById("monthDropdown")
            .setAttribute("hidden", "true");
          localStorage.setItem("adminBtn", btnList[index]);

          var card1_name = document.getElementById("card1_name");
          page_name = localStorage.getItem("adminBtn");
          card1_name.innerText = page_name;

          var url = `/static/ai_front/json_files/data_reports/data_reports.json`;
          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              // Handle the retrieved JSON data here
              results = data[btnList[index].replace("(", "").replace(")", "")];
              console.log(results);
              // Handle click for the button
              const body = document.getElementById("prom_table");
              while (body.firstChild) {
                body.removeChild(body.firstChild);
              }

              // Create the table element
              var table = document.createElement("table");
              table.classList.add("table", "jsonData4");

              // Create table headers dynamically
              var headers = Object.keys(results[0]);
              var headerRow = document.createElement("tr");

              headers.forEach(function (header) {
                var th = document.createElement("th");
                th.style.textAlign = "center";
                th.textContent = header;
                headerRow.appendChild(th);
              });

              table.appendChild(headerRow);

              // Create table body dynamically
              results.forEach(function (result) {
                var row = document.createElement("tr");

                headers.forEach(function (header, index) {
                  var cell = document.createElement("td");

                  if (index > 3) {
                    // Add commas every three digits
                    cell.textContent = formatNumberWithCommas(result[header]);
                    cell.style.textAlign = "right";
                  } else {
                    cell.textContent = result[header];
                    cell.style.textAlign = "center";
                  }

                  row.appendChild(cell);
                });

                table.appendChild(row);
              });

              // Append the table to the element with the ID 'prom_table'
              body.appendChild(table);
            })
            .catch((error) => {
              console.error("Fetch error:", error);
            });
        });
        adminMenu.appendChild(button);
      })(i);
    }

    var button3 = createButton("admin_btn3", "세부내역2");
    button3.addEventListener("click", function () {
      localStorage.setItem("adminBtn", "세부내역2");
      // Handle click for 세부내역2 button
      document.getElementById("monthDropdown").setAttribute("hidden", true);
      const body = document.getElementById("prom_table");
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      getUserData();
    });
    adminMenu.appendChild(button3);
  }
}

//비밀번호 변경
function changePassword() {
  admincheck = localStorage.username;

  floatingInputPassword = document.getElementById("floatingInputPassword")
    .value;
  floatingInputNewPassword = document.getElementById("floatingInputNewPassword")
    .value;
  floatingInputNewPasswordConfirm = document.getElementById(
    "floatingInputNewPasswordConfirm"
  ).value;
  if (admincheck == "admin") {
    // alert("어드민 계정은 비밀번호 수정이 불가합니다.")
    Swal.fire({
      // title: '패스워드!',
      text: "어드민 계정은 비밀번호 수정이 불가합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } else if (
    floatingInputNewPassword == "" ||
    floatingInputNewPasswordConfirm == "" ||
    floatingInputPassword == ""
  ) {
    // alert("입력을 확인하세요.")
    Swal.fire({
      // title: '패스워드!',
      text: "입력을 확인하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } else if (floatingInputNewPassword.length < 4) {
    // alert("변경 할 비밀번호가 일치하지 않습니다.")
    Swal.fire({
      // title: '패스워드!',
      text: "변경 할 비밀번호는 4자리 이상입니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    document.getElementById("floatingInputNewPasswordConfirm").focus();
  } else if (floatingInputNewPassword !== floatingInputNewPasswordConfirm) {
    // alert("변경 할 비밀번호가 일치하지 않습니다.")
    Swal.fire({
      // title: '패스워드!',
      text: "변경 할 비밀번호가 일치하지 않습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    document.getElementById("floatingInputNewPasswordConfirm").focus();
  } else if (floatingInputPassword == floatingInputNewPassword) {
    // alert("동일한 비밀번호로 변경 할 수 없습니다.")
    Swal.fire({
      // title: '패스워드!',
      text: "동일한 비밀번호로 변경 할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } else {
    document.getElementById("loadingOverlay").classList.remove("d-none");
    document.getElementById("loadingSpinner").classList.remove("d-none");
    const url = "/users/api/changepassword";

    // Sending data in the request body for a POST request
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: admincheck,
        floatingInputPassword: floatingInputPassword,
        floatingInputNewPassword: floatingInputNewPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("loadingOverlay").classList.add("d-none");
        document.getElementById("loadingSpinner").classList.add("d-none");

        if (data.message == "비밀번호 변경 성공!") {
          // alert(
          //   `${data.message}\n다시 로그인하세요.`
          // );
          Swal.fire({
            // title: '패스워드!',
            text: `${data.message}\n다시 로그인하세요.`,
            icon: "success",
            confirmButtonText: "확인",
          }).then((result) => {
            if (result.isConfirmed) {
              handleLogout();
            }
          });
        } else {
          // alert("현재 비밀번호를 확인하세요.\n존재하지 않는 정보입니다.");
          Swal.fire({
            // title: '패스워드!',
            text: `현재 비밀번호를 확인하세요.\n존재하지 않는 정보입니다.`,
            icon: "warning",
            confirmButtonText: "확인",
          });
          document.getElementById("floatingInputPassword").focus();
        }
        // console.log(data.message);
      })
      .catch((error) => console.error("Error:", error));
  }
}

//페이지 새로고침
function reloadPage() {
  location.reload();
}

//양도양수 다운로드
function download_yang(row_No) {
  url = currentURL = window.location.href;
  if (!url.includes("192.168.1.2:8001")) {
    Swal.fire({
      text: "http://192.168.1.2:8001/ 에서 다운로드가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } else {
    console.log(row_No);
    SetDate = document.getElementById(`${row_No}_1`).value;
    RawId = document.getElementById(`${row_No}_4`).textContent;
    console.log(SetDate, RawId);

    if (SetDate == "") {
      Swal.fire({
        text: "날짜가 선택되지 않았습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById(`${row_No}_1`).focus();
        }
      });
    } else {
      // Make an API call
      fetch("/api/YangDown/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.access, // Pass the access token as "token"
          username: localStorage.username,
          SetDate: SetDate,
          RawId: RawId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          do_date = data.res.양도일;
          do_baemin = data.res.양도.baemin;
          do_coupang = data.res.양도.coupang;
          soo_date = data.res.양수일;
          soo_baemin = data.res.양수.baemin;
          soo_coupang = data.res.양수.coupang;

          const firstElementKey = Object.keys(do_baemin[0]);
          const resultArray = [{}];
          firstElementKey.forEach((key) => {
            resultArray[0][key] = key;
          });
          console.log(resultArray);

          list_csv = [
            resultArray,
            do_baemin,
            do_coupang,
            [{ 양도일: do_date[0] }],
            resultArray,
            soo_baemin,
            soo_coupang,
            [{ 양수일: soo_date[0] }],
          ];

          // Combine the CSV data
          const combinedData = [];
          for (const csvData of list_csv) {
            if (csvData) {
              // Add a null check here
              combinedData.push(...csvData);
            }
          }
          // console.log(combinedData);

          function downloadCSV(data) {
            const csv = data
              .map((row) => Object.values(row).join(","))
              .join("\n");
            const blob = new Blob(["\ufeff", csv], {
              type: "text/csv;charset=euc-kr;",
            });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `양도양수_${RawId}.csv`);
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
          }


          // Example usage with combined data
          downloadCSV(combinedData);
        })
        .catch((error) => {
          console.error("API error:", error);
          Swal.fire({
            text: "존재하지 않는 데이터입니다. 날짜를 확인하세요.",
            icon: "warning",
            confirmButtonText: "확인",
          }).then((result) => {
            if (result.isConfirmed) {
              document.getElementById(`${row_No}_1`).focus();
            }
          });
        });
    }
  }
}
