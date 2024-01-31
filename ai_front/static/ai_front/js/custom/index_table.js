const getUserData = async () => {
  //고객 정보 들고오기
  //고객 정보 들고오기
  //고객 정보 들고오기
  const accessToken = localStorage.getItem("access");
  const response = await fetch(`/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Use backticks around the whole string
    },
  });

  const userData = await response.json(); // Parse response data as JSON
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

  // table show
  // table show
  // table show
  if (userData.username === "admin") {
    adminStart();
    return;
  } else {
    othersStart(userData.biz_no);
    return;
  }
};

//어드민
//어드민
//어드민
//어드민
//어드민
function adminStart() {
  //
  document.getElementById("card1_name").textContent = "어드민";
  document.getElementById("userinfo").textContent = "ADMIN";
  document.getElementById("username").textContent = "어드민";

  url = "/api/AdminData/";
  const data = {
    token: localStorage.getItem("access"),
    username: localStorage.getItem("username"),
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
      adminData(data["adminData"], url);
    })
    .catch((error) => console.error("Error:", error));
}

function adminData(data, url) {
  console.log(data);
  console.log(url);

  //container
  var containerDiv = document.createElement("div");
  containerDiv.className = "container mt-4";
  var tableContainerDiv = document.createElement("div");
  tableContainerDiv.id = "tableContainer";
  tableContainerDiv.className = "table-responsive";
  containerDiv.appendChild(tableContainerDiv);
  var bodyElement = document.getElementById("prom_table");
  bodyElement.appendChild(containerDiv);

  var table = document.createElement("table");
  table.classList.add(
    "table",
    "table-striped",
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
    headerRow.appendChild(th);
  });

  // Add a button in the last th
  if (url.includes("AdminData")) {
    var buttonTh = document.createElement("th");
    buttonTh.textContent = "Button";
    headerRow.appendChild(buttonTh);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create the table body
  var tbody = document.createElement("tbody");
  data.forEach((item, rowIndex) => {
    var row = document.createElement("tr");
    var isFirstTd = true;

    Object.entries(item).forEach(([key, value], colIndex) => {
      var td = document.createElement("td");

      // Check if it's the first td and create an input box
      if (isFirstTd) {
        var input = document.createElement("input");
        input.classList.add("form-control", "form-control-sm"); // Bootstrap class for styling
        input.type = "text";
        input.value = value === null ? "null" : value;
        input.id = `row_${rowIndex}_${colIndex}`;
        td.appendChild(input);
        isFirstTd = false;
      } else {
        // If value is null, add a class for yellow background
        if (value === null) {
          td.classList.add("bg-warning");
        }
        td.id = `row_${rowIndex}_${colIndex}`;
        td.textContent = value === null ? "null" : value;

        // Check if it's the second column (index 1) and create a hyperlink
        if (colIndex === 1) {
          var link = document.createElement("a");
          link.setAttribute("onclick", `othersStart(${value})`);
          link.textContent = value;
          link.style.color = "blue";
          link.style.cursor = "pointer";
          td.innerHTML = ""; // Clear td content
          td.appendChild(link);
        }
      }

      row.appendChild(td);
    });
    if (url.includes("AdminData")) {
      // Add a button in the last td
      var buttonTd = document.createElement("td");
      var button = document.createElement("button");
      button.classList.add("btn", "btn-primary", "btn-sm");
      button.id = `button_${rowIndex}`; // Unique ID for the button
      button.setAttribute("onclick", `remarkSave('row_${rowIndex}_')`); // Set onclick attribute
      button.textContent = "Save";
      buttonTd.appendChild(button);
      row.appendChild(buttonTd);
    }
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Append the table to the container
  tableContainerDiv.appendChild(table);
}

//고객정보
//고객정보
//고객정보
//고객정보
//고객정보
function othersStart(biz_no) {
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

  var url1 = `/static/ai_front/json_files/data/${biz_no}_baedal.json`;
  var url2 = `/static/ai_front/json_files/data/${biz_no}_coupang.json`;

  // Use Promise.all to fetch data from both URLs concurrently
  Promise.all([fetchData(url1), fetchData(url2)])
    .then((results) => {
      // results is an array containing the data from both URLs
      const dataFromUrl1 = results[0];
      const dataFromUrl2 = results[1];

      // Do something with the JSON data from both URLs
      console.log("baedal:", dataFromUrl1);
      console.log("coupang:", dataFromUrl2);

      //container
      var containerDiv = document.createElement("div");
      containerDiv.className = "container mt-4";
      var tableContainerDiv = document.createElement("div");
      tableContainerDiv.id = "tableContainer";
      tableContainerDiv.className = "table-responsive";
      containerDiv.appendChild(tableContainerDiv);
      var bodyElement = document.getElementById("prom_table");
      bodyElement.appendChild(containerDiv);

      //점주
      document.getElementById("card1_name").textContent = "프로모션 과금 내역";
      if (dataFromUrl1 != undefined) {
        jsonToTable(dataFromUrl1, "baedal");
      }
      if (dataFromUrl2 != undefined) {
        jsonToTable(dataFromUrl2, "coupang");
      } else {
        console.log("no data");
        tableContainerDiv.textContent = "이벤트 내역이 없습니다.";
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

function remarkSave(rowIndex) {
  // Log information from localStorage
  console.log(localStorage.username);
  console.log(localStorage.access);

  // Get data from the HTML elements
  const rawNo = document.getElementById(rowIndex + "1").textContent;
  const remarkText = document.getElementById(rowIndex + "0").value;

  // Log data from the HTML elements
  console.log(rawNo);
  console.log(remarkText);

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
      remarkText: remarkText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.res == "saved") {
        window.location.reload();
      }
      // Handle the response data as needed
    })
    .catch((error) => {
      console.error("API error:", error);
      // Handle errors
    });
}

function jsonToTable(jsonData, filename) {
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
    if (key !== "사업자번호") {
      var th = document.createElement("th");
      th.textContent = key;

      if (["년월", "브랜드", "행사"].includes(key)) {
        th.style.textAlign = "left";
      } else {
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
    for (var key in jsonData[i]) {
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

        cell.textContent = cellContent;
        row.appendChild(cell);
      }
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  //header_Get from jsonData
  function getKeysWithTerm(obj, term) {
    let keys = [];
    for (let key in obj) {
      if (key.includes(term)) {
        keys.push(key);
      }
    }
    return keys;
  }

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
    var pay_first = getKeysWithTerm(jsonData[0], "과금1차");
    var pay_second = getKeysWithTerm(jsonData[0], "과금2차");
    var sumColumns = ["건수", "총합계", `${pay_first}`, `${pay_second}`];
  } else if (filename.includes("coupang")) {
    var pay_copang = getKeysWithTerm(jsonData[0], "과금");
    var sumColumns = ["건수", "총합계", `${pay_copang}`];
  }
  for (var i = 0; i < sumColumns.length; i++) {
    var sumCell = document.createElement("td");
    //쿠팡 총합계 표시 안함
    if (filename.includes("coupang") && sumColumns[i] == "총합계") {
      sumCell.textContent = "";
    } else {
      temp_text = String(
        formatNumberWithCommas(
          Math.round(calculateSum(jsonData, sumColumns[i]))
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

// Function to calculate the sum for a specific column
function calculateSum(data, column) {
  var sum = 0;
  for (var i = 0; i < data.length; i++) {
    sum += parseFloat(data[i][column]) || 0;
  }
  return sum;
}

function createTitle(filename) {
  var titleElement = document.createElement("h3");
  titleElement.id = "title";
  titleElement.classList.add("text-center");
  titleElement.style.marginBottom = "20px";
  titleElement.style.fontWeight = "bold";
  if (filename.includes("baedal")) {
    titleElement.textContent = "배달의민족";
  } else if (filename.includes("coupang")) {
    titleElement.textContent = "쿠팡이츠";
  }
  return titleElement;
}

// Function to format a number with commas every three digits
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function adminTotal() {
  console.log("admin total");
  url = "/api/AdminTotal/";
  const data = {
    token: localStorage.getItem("access"),
    username: localStorage.getItem("username"),
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
      adminData(data["adminData"], url);
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  getUserData();

  if (localStorage.username === "admin") {
    // Function to create a button
    function createButton(id, text) {
      var button = document.createElement("button");
      button.id = id;
      button.className = "btn btn-primary btn-sm mr-1";
      button.type = "button";
      button.textContent = text;
      return button;
    }

    // Append buttons to the ul element
    var adminMenu = document.getElementById("admin_menu");

    var button1 = createButton("admin_btn1", "총금액");
    button1.addEventListener("click", function () {
      // Handle click for 총금액 button
      const body = document.getElementById("prom_table");
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      adminTotal();
    });
    adminMenu.appendChild(button1);

    var button2 = createButton("admin_btn2", "세부내역");
    button2.addEventListener("click", function () {
      // Handle click for 세부내역 button
      const body = document.getElementById("prom_table");
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      getUserData();
    });
    adminMenu.appendChild(button2);

  }
});


//비밀번호 변경
function changePassword() {

  admincheck = localStorage.username

  floatingInputPassword = document.getElementById("floatingInputPassword").value;
  floatingInputNewPassword = document.getElementById("floatingInputNewPassword").value;
  floatingInputNewPasswordConfirm = document.getElementById("floatingInputNewPasswordConfirm").value;
  if (admincheck == "admin") {
    alert("어드민 계정은 비밀번호 수정이 불가합니다.")
  } else if (floatingInputNewPassword == "" || floatingInputNewPasswordConfirm == "" || floatingInputPassword == "") {
    alert("입력을 확인하세요.")
  } else if (floatingInputNewPassword!== floatingInputNewPasswordConfirm) {
    alert("변경 할 비밀번호가 일치하지 않습니다.")
    document.getElementById("floatingInputNewPasswordConfirm").focus();
  } else if (floatingInputPassword== floatingInputNewPassword) {
    alert("동일한 비밀번호로 변경 할 수 없습니다.")
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

        if (data.message !== "User not found") {
          alert(
            `${data.message}\n다시 로그인하세요.`
          );
          handleLogout();
        } else {
          alert("현재 비밀번호를 확인하세요.\n존재하지 않는 정보입니다.");
          document.getElementById("floatingInputPassword").focus();
        }
        console.log(data.message);
      })
      .catch((error) => console.error("Error:", error));
  }
}