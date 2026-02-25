function formatGBP(value) {
  if (isNaN(value)) return "–";
  return "£" + value.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function calculateCarBudget(income, otherDebt, runningCosts) {
  const safePayment = income * 0.1;   // 10%
  const stretchPayment = income * 0.15; // 15%
  const allInLimit = income * 0.2;   // 20%

  const estimatedAllIn =
    (isNaN(runningCosts) ? 0 : runningCosts) +
    // assume you might take the 10% finance as a starting point
    safePayment;

  const totalDebt =
    (isNaN(otherDebt) ? 0 : otherDebt) +
    safePayment; // using safe payment as candidate car finance

  const debtToIncome = income > 0 ? totalDebt / income : 0;

  return {
    safePayment,
    stretchPayment,
    allInLimit,
    estimatedAllIn,
    totalDebt,
    debtToIncome
  };
}

function updateResults(result) {
  const safeEl = document.getElementById("safe-payment");
  const stretchEl = document.getElementById("stretch-payment");
  const allInEl = document.getElementById("all-in-limit");
  const estAllInEl = document.getElementById("estimated-all-in");
  const summaryNoteEl = document.getElementById("summary-note");
  const debtNoteEl = document.getElementById("debt-note");

  safeEl.textContent = formatGBP(result.safePayment);
  stretchEl.textContent = formatGBP(result.stretchPayment);
  allInEl.textContent = formatGBP(result.allInLimit);
  estAllInEl.textContent = formatGBP(result.estimatedAllIn);

  safeEl.className = "result-value safe";
  stretchEl.className = "result-value stretch";
  allInEl.className = "result-value";
  estAllInEl.className = "result-value";

  if (result.estimatedAllIn <= result.allInLimit * 0.9) {
    summaryNoteEl.textContent =
      "Your estimated total car costs stay comfortably within 20% of your net income.";
  } else if (result.estimatedAllIn <= result.allInLimit * 1.1) {
    summaryNoteEl.textContent =
      "Your estimated total car costs are around the 20% upper guideline – worth double-checking your budget.";
  } else {
    summaryNoteEl.textContent =
      "Your estimated total car costs are above 20% of your net income. Consider a cheaper car or lower running costs.";
  }

  if (result.debtToIncome > 0.4) {
    debtNoteEl.textContent =
      "Warning: with this car payment, your total monthly debt would be over 40% of your income – many lenders see this as high.";
  } else if (result.debtToIncome > 0.36) {
    debtNoteEl.textContent =
      "Note: your total monthly debt would be around the upper 36% guideline that many lenders use.[web:8][web:19][web:20]";
  } else if (result.debtToIncome > 0) {
    debtNoteEl.textContent =
      "Your total monthly debt would be within typical affordability guidelines.";
  } else {
    debtNoteEl.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("car-form");
  const errorMessageEl = document.getElementById("error-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const incomeInput = document.getElementById("income");
    const otherDebtInput = document.getElementById("other-debt");
    const runningCostsInput = document.getElementById("running-costs");

    const income = parseFloat(incomeInput.value);
    const otherDebt = parseFloat(otherDebtInput.value);
    const runningCosts = parseFloat(runningCostsInput.value);

    if (isNaN(income) || income <= 0) {
      errorMessageEl.textContent =
        "Please enter your monthly net income as a positive number.";
      return;
    }

    errorMessageEl.textContent = "";

    const result = calculateCarBudget(income, otherDebt, runningCosts);
    updateResults(result);
  });
});
