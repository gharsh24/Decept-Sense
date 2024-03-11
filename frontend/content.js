function detectDarkPatterns() {
  const spanElements = document.querySelectorAll("span");

  // Extract text content from each span element, remove empty spaces, and merge multiple spaces
  const spanTexts = Array.from(spanElements).map((span) =>
    span.innerText.replace(/\s+/g, " ").replace(/\n/g, "").trim()
  );

  console.log("All Spans:", spanTexts);

  // Prepare the data to be sent to the FastAPI backend
  const postData = {
    texts: spanTexts,
  };

  // Initialize darkPatternVariables to zero
  const darkPatternVariables = {
    scarcity: 0,
    forced: 0,
    urgency: 0,
    proof: 0,
    sneaking: 0,
    obstruction: 0,
    misdirection: 0,
    subtrap: 0,
  };

  //Handle hover over the spans
  function handleHover(i, predictedCategory) {
    spanElements[i].style.position = "relative";
    // Create a new element for the small text
    const smallTextElement = document.createElement("span");
    smallTextElement.textContent = `${predictedCategory}`;
    smallTextElement.className = "small-text";
    smallTextElement.style.position = "absolute";
    smallTextElement.style.top = "-10px";
    smallTextElement.style.right = "-5";
    smallTextElement.style.backgroundColor = "#333";
    smallTextElement.style.color = "#fff";
    smallTextElement.style.padding = "5px";
    smallTextElement.style.borderRadius = "5px";
    smallTextElement.style.fontSize = "0.5rem";
    // Append the small text element to the span
    spanElements[i].appendChild(smallTextElement);
  }
  function handleHoverForStrikethrough(i, predictedCategory) {
    // Assuming you have a NodeList of <s> tags
    const strikethroughElements = document.querySelectorAll("s");

    // Check if the index is within the bounds of the NodeList
    if (i >= 0 && i < strikethroughElements.length) {
      const strikethroughElement = strikethroughElements[i];

      // Set position to relative for proper positioning of the small text
      strikethroughElement.style.position = "relative";

      // Create a new element for the small text
      const smallTextElement = document.createElement("span");
      smallTextElement.textContent = `${predictedCategory}`;
      smallTextElement.className = "small-text";
      smallTextElement.style.position = "absolute";
      smallTextElement.style.top = "-10px";
      smallTextElement.style.right = "-5px"; // Added 'px' to the right property
      smallTextElement.style.backgroundColor = "#333";
      smallTextElement.style.color = "#fff";
      smallTextElement.style.padding = "5px";
      smallTextElement.style.borderRadius = "5px";
      smallTextElement.style.fontSize = "0.5rem";

      // Append the small text element to the <s> element
      strikethroughElement.appendChild(smallTextElement);

      // strikethroughElement.addEventListener("mouseover", () => {
      //   // Show the small text on hover
      //   smallTextElement.style.display = "inline-block";
      // });

      // Hover out event for <s> element
      strikethroughElement.addEventListener("mouseout", () => {
        // Remove the small text element on hover out
        smallTextElement.remove();
      });
    }
  }
  // Make a POST request to the FastAPI backend
  fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Predicted Categories:", data.predicted_categories);
      const predictedCategories = data.predicted_categories;

      for (let i = 0; i < spanTexts.length; i++) {
        // Check if spanTexts[i] is defined and not empty
        if (!spanTexts[i] || spanTexts[i].length === 0) {
          continue;
        }

        if (spanTexts[i].innerText === "/" || spanTexts[i].length < 5) {
          continue;
        }
        if (predictedCategories[i] === "undefined") console.log("undefined");
        if (spanElements[i].classList.contains("a-text-strike")) {
          spanElements[i].style.backgroundColor = "aqua";
          spanElements[i].style.border = "1px solid black";
          spanElements[i].addEventListener("mouseover", () => {
            // Call the function to handle hover and create small text element
            handleHover(i, "Misdirection");
          });
          darkPatternVariables.misdirection++;

          //Hover out
          //Hover out
          spanElements[i].addEventListener("mouseout", () => {
            // Remove the small text element based on its tag name and class
            const smallTextElement =
              spanElements[i].querySelector("span.small-text");

            if (smallTextElement) {
              smallTextElement.remove();
            }
          });
        }
        if (spanElements[i].classList.contains("STRIKETHROUGH")) {
          spanElements[i].style.backgroundColor = "aqua";
          spanElements[i].style.border = "1px solid black";
          spanElements[i].addEventListener("mouseover", () => {
            // Call the function to handle hover and create small text element
            handleHover(i, "Misdirection");
          });
          darkPatternVariables.misdirection++;

          //Hover out
          //Hover out
          spanElements[i].addEventListener("mouseout", () => {
            // Remove the small text element based on its tag name and class
            const smallTextElement =
              spanElements[i].querySelector("span.small-text");

            if (smallTextElement) {
              smallTextElement.remove();
            }
          });
        }
        if (predictedCategories[i] !== "Not Dark Pattern") {
          spanElements[i].style.backgroundColor = "aqua";
          spanElements[i].style.border = "1px solid black";

          // On hover
          spanElements[i].addEventListener("mouseover", () => {
            // Call the function to handle hover and create small text element
            handleHover(i, predictedCategories[i]);
          });

          //Hover out
          //Hover out
          spanElements[i].addEventListener("mouseout", () => {
            // Remove the small text element based on its tag name and class
            const smallTextElement =
              spanElements[i].querySelector("span.small-text");

            if (smallTextElement) {
              smallTextElement.remove();
            }
          });

          console.log(spanTexts[i], " -> ", predictedCategories[i]);
        }

        if (predictedCategories[i] === "Scarcity")
          darkPatternVariables.scarcity++;

        if (predictedCategories[i] === "Forced Action")
          darkPatternVariables.forced++;

        if (predictedCategories[i] === "Urgency")
          darkPatternVariables.urgency++;

        if (predictedCategories[i] === "Social Proof")
          darkPatternVariables.proof++;

        if (predictedCategories[i] === "Sneaking")
          darkPatternVariables.sneaking++;

        if (predictedCategories[i] === "Obstruction")
          darkPatternVariables.obstruction++;

        if (predictedCategories[i] === "Misdirection")
          darkPatternVariables.misdirection++;

        if (predictedCategories[i] === "Subscription trap")
          darkPatternVariables.subtrap++;
      }
      const strikethroughElements = document.querySelectorAll("s");

      for (let i = 0; i < strikethroughElements.length; i++) {
        // Check if the current <s> element exists and is not empty
        if (
          !strikethroughElements[i] ||
          strikethroughElements[i].innerText.trim().length === 0
        ) {
          continue;
        }

        // Apply styling based on your conditions
        // For example, let's change the color of <s> tags to red
        darkPatternVariables.misdirection++;
        strikethroughElements[i].style.backgroundColor = "aqua";
        strikethroughElements[i].style.color = "black";
        strikethroughElements[i].style.border = "1px solid black";
        strikethroughElements[i].addEventListener("mouseover", () => {
          // Call the function to handle hover and create small text element
          handleHoverForStrikethrough(i, "Misdirection");
        });

        strikethroughElements[i].addEventListener("mouseout", () => {
          // Remove the small text element based on its tag name and class
          const smallTextElement =
            spanElements[i].querySelector("span.small-text");

          if (smallTextElement) {
            smallTextElement.remove();
          }
        });
      }

      let darkPatternCounts = {
        scarcity: darkPatternVariables.scarcity,
        forced: darkPatternVariables.forced,
        urgency: darkPatternVariables.urgency,
        proof: darkPatternVariables.proof,
        sneaking: darkPatternVariables.sneaking,
        obstruction: darkPatternVariables.obstruction,
        misdirection: darkPatternVariables.misdirection,
        subtrap: darkPatternVariables.subtrap,
        totalCount:
          darkPatternVariables.scarcity +
          darkPatternVariables.forced +
          darkPatternVariables.urgency +
          darkPatternVariables.proof +
          darkPatternVariables.sneaking +
          darkPatternVariables.obstruction +
          darkPatternVariables.misdirection +
          darkPatternVariables.subtrap,
      };

      // store number of dark patterns

      let g = document.createElement("div");
      g.id = "insite_count";
      g.value = JSON.stringify(darkPatternCounts);
      g.style.opacity = 0;
      g.style.position = "fixed";
      console.log(g.value);
      document.body.appendChild(g);
      sendDarkPatterns(g.value);

      chrome.runtime.sendMessage({ darkPatternVariables });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // No need to send a message here, as it's already sent inside the fetch's then block
}

function sendDarkPatterns(data) {
  chrome.runtime.sendMessage({
    message: "update_current_count",
    counts: data,
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "submit_report") {
    console.log("submit_report");
    console.log(request.reportData.name);
    console.log(request.reportData.category);

    fetch("http://localhost:8000/submit_report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.reportData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // document.getElementById("fname").value = "";
        // document.getElementById("dark-pattern-cat").value = "Scarcity";

        chrome.runtime.sendMessage({ action: "showNotification" });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // });
  }

  if (request.message === "invokeContentFunction") {
    let element = document.getElementById("insite_count");
    if (element) {
      sendDarkPatterns(element.value);
    }
    detectDarkPatterns();
  } else if (request.message === "popup_open") {
    let element = document.getElementById("insite_count");
    if (element) {
      sendDarkPatterns(element.value);
    }
  }
});
