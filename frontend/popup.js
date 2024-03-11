window.onload = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

  document.getElementById("detectButton").onclick = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "invokeContentFunction" });
    });
  };
  document
    .getElementById("submitReport")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let reportData = {
        category: document.getElementById("dark-pattern-cat").value,
        name: document.getElementById("fname").value,
      };
      console.log(reportData);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          message: "submit_report",
          reportData: reportData,
        });
      });
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_current_count") {
    console.log("update_current_count");
    let counts = JSON.parse(request.counts);

    document.getElementById("thispage").innerText = `${counts.totalCount}`;
    document.getElementById("scar").innerText = `${counts.scarcity}`;
    document.getElementById("social").innerText = `${counts.proof}`;
    document.getElementById("mis").innerText = `${counts.misdirection}`;
    document.getElementById("ur").innerText = `${counts.urgency}`;
    document.getElementById("obs").innerText = `${counts.obstruction}`;
    document.getElementById("sneak").innerText = `${counts.sneaking}`;
    document.getElementById("subs").innerText = `${counts.subtrap}`;
    document.getElementById("force").innerText = `${counts.forced}`;

    document
      .querySelector(".progressdiv")
      .setAttribute("data-percent", `${counts.totalCount}`);
    progress_bar();
  }
});

// Request dark pattern variables from the background script
chrome.runtime.sendMessage(
  { action: "getDarkPatternVariables" },
  (response) => {
    if (response.darkPatternVariables) {
      // Access the darkPatternVariables directly
      const {
        scarcity,
        forced,
        urgency,
        proof,
        sneaking,
        obstruction,
        misdirection,
        subtrap,
      } = response.darkPatternVariables;

      // Now you can use these variables as needed in your popup.js
      console.log(
        "Received Variables:",
        sneaking,
        forced,
        urgency,
        proof,
        subtrap,
        scarcity,
        obstruction,
        misdirection
      );
      const totalCount =
        scarcity +
        forced +
        urgency +
        proof +
        sneaking +
        obstruction +
        misdirection +
        subtrap;

      console.log("hellllo");
      // Display the total count in the element with ID "thispage"
      document.getElementById("thispage").innerText = `${totalCount}`;

      document.getElementById("scar").innerText = `${scarcity}`;
      document.getElementById("social").innerText = `${proof}`;
      document.getElementById("mis").innerText = `${misdirection}`;
      document.getElementById("ur").innerText = `${urgency}`;
      document.getElementById("obs").innerText = `${obstruction}`;
      document.getElementById("sneak").innerText = `${sneaking}`;
      document.getElementById("subs").innerText = `${subtrap}`;
      document.getElementById("force").innerText = `${forced}`;

      document
        .querySelector(".progressdiv")
        .setAttribute("data-percent", totalCount);
      progress_bar();
    }
  }
);

function progress_bar() {
  // window.onload = function () {
  var totalProgress, progress, total, offuse;
  var path = document.querySelectorAll(".progress");
  console.log(path);
  for (var i = 0; i < path.length; i++) {
    totalProgress = path[i]
      .querySelector("path")
      .getAttribute("stroke-dasharray");

    progress = path[i].parentElement.getAttribute("data-percent");
    total = path[i].parentElement.getAttribute("total-data");
    offuse = path[i].parentElement.getAttribute("offuse-data");

    var percent = parseInt(
      document.querySelector(".progressdiv").getAttribute("data-percent")
    );
    var offsetData = parseInt(
      document.querySelector(".progressdiv").getAttribute("offuse-data")
    );
    var usedData = percent + offsetData;
    var all = (totalProgress * progress) / total;
    var act = totalProgress - all;
    path[i].querySelector(".online").style["stroke-dashoffset"] = act;

    var offdata = (totalProgress * usedData) / total;
    var offdatas = totalProgress - offdata;
    path[i].querySelector(".offline").style["stroke-dashoffset"] = offdatas;

    path[i].querySelector(".white1").style["stroke-dashoffset"] = act + 5;
  }
  // };
}

// document.getElementById("submitReport").addEventListener("click", function (e) {
//   e.preventDefault();
//   let activeTabUrl;
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     activeTabUrl = tabs[0].url;
//   });
//   let reportData = {
//     url: activeTabUrl,
//     category: document.getElementById("dark-pattern-cat").value,
//     name: document.getElementById("fname").value,
//   };

//   fetch("http://localhost:8000/submit_report", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(reportData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Success:", data);
//       document.getElementById("fname").value = "";
//       document.getElementById("dark-pattern-cat").value = "Scarcity";
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// });
