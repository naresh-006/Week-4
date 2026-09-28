document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
      }
    });
  });

  const menuButton = document.querySelector(".mobile-menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const responsiveMenuButton = document.querySelector("#about-menu-toggle, #home-menu-toggle");
  const responsiveNavigation = responsiveMenuButton
    ? document.getElementById(responsiveMenuButton.getAttribute("aria-controls"))
    : null;

  if (responsiveMenuButton && responsiveNavigation) {
    const closeResponsiveNavigation = () => {
      responsiveNavigation.classList.remove("is-open");
      responsiveMenuButton.setAttribute("aria-expanded", "false");
      responsiveMenuButton.setAttribute("aria-label", "Open navigation");
    };

    responsiveMenuButton.addEventListener("click", () => {
      const isOpen = responsiveNavigation.classList.toggle("is-open");
      responsiveMenuButton.setAttribute("aria-expanded", String(isOpen));
      responsiveMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    responsiveNavigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeResponsiveNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeResponsiveNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeResponsiveNavigation();
    });
  }

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && sidebar) {
      sidebar.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });

  const requestJSON = async (url, options = {}) => {
    let response;
    try {
      response = await fetch(url, {
        credentials: "same-origin",
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });
    } catch {
      throw new Error("Can't reach the banking service. Run npm run dev in bank-of-kubera and open the URL it prints, usually http://localhost:3000.");
    }

    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (url.startsWith("/api/") && response.status !== 204 && !isJson) {
      throw new Error("The banking service isn't available at this address. Open the app using the URL printed by npm run dev, usually http://localhost:3000.");
    }
    const result = response.status === 204 ? null : isJson ? await response.json().catch(() => null) : null;
    if (!response.ok) throw new Error(result?.error || "The request could not be completed.");
    return result;
  };

  const authenticatedUser = requestJSON("/api/auth/me")
    .then((result) => result.user)
    .catch(() => null);

  authenticatedUser.then(async (user) => {
    if (!user) return;

    document.querySelectorAll(".header-actions a[href$='login.html']").forEach((link) => {
      link.href = new URL("dashboard.html", link.href).href;
      link.textContent = "Dashboard";
    });

    const heroAccountPreview = document.querySelector("#hero-account-preview");
    const previewAuthLabel = document.querySelector("#preview-auth-label");
    const previewAuthLink = document.querySelector("#preview-auth-link");
    if (heroAccountPreview) heroAccountPreview.textContent = `${user.displayName.split(" ")[0]}'s overview`;
    if (previewAuthLabel) previewAuthLabel.textContent = user.isDemo ? "Demo preview · sample data" : "Your private overview";
    if (previewAuthLink) {
      previewAuthLink.href = new URL("dashboard.html", previewAuthLink.href).href;
      previewAuthLink.textContent = "Open dashboard ↗";
    }

    const activityChart = document.querySelector("#preview-activity-chart");
    if (activityChart) {
      activityChart.classList.remove("is-locked");
      activityChart.setAttribute("aria-label", "Account activity overview");
    }

    try {
      const [{ accounts }, { transactions }, cards, billers] = await Promise.all([
        requestJSON("/api/accounts"),
        requestJSON("/api/transactions"),
        requestJSON("/data/demo-cards.json"),
        requestJSON("/data/demo-billers.json"),
      ]);
      const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
      const total = accounts.reduce((sum, account) => sum + account.balance, 0);
      const checking = accounts.find((account) => account.type.toLowerCase() === "checking");
      const savings = accounts.find((account) => account.type.toLowerCase() === "savings");
      const card = accounts.find((account) => account.type.toLowerCase() === "credit");
      const linkedCard = cards[0];
      const firstBiller = billers[0];
      const values = {
        "account-total": currency.format(total),
        "checking-preview": checking ? currency.format(checking.balance) : "No checking account",
        "savings-preview": savings ? currency.format(savings.balance) : "No savings account",
        "checking-summary-preview": checking?.maskedNumber || "No checking account",
        "savings-summary-preview": savings?.maskedNumber || "No savings account",
        "card-summary-preview": card?.maskedNumber || "No credit account",
        "card-number-preview": linkedCard?.maskedNumber || "No card linked",
        "cardholder-preview": linkedCard?.holderName || "No card linked",
        "card-expiry-preview": linkedCard?.expiry || "--/--",
        "card-status-preview": linkedCard?.status || "No card linked",
        "bill-name-preview": firstBiller?.name || "No bills scheduled",
        "bill-amount-preview": firstBiller ? currency.format(firstBiller.amount) : "--",
        "bill-count-preview": `${billers.length} scheduled`,
        "bill-progress-label": billers.length ? "Scheduled payments" : "No payments scheduled",
        "bill-progress-preview": billers.length ? "View" : "--",
        "balance-preview": currency.format(total),
      };
      Object.entries(values).forEach(([elementId, value]) => {
        const previewElement = document.getElementById(elementId);
        if (previewElement) previewElement.textContent = value;
      });

      const activityChart = document.querySelector("#preview-activity-chart");
      if (activityChart) {
        const chartBars = activityChart.querySelectorAll(".bar");
        const recentAmounts = transactions.slice(0, chartBars.length).map((transaction) => transaction.amount).reverse();
        if (recentAmounts.length) {
          const maxAmount = Math.max(...recentAmounts);
          chartBars.forEach((bar, index) => {
            const amount = recentAmounts[index] || 0;
            bar.style.height = `${Math.max(12, Math.round((amount / maxAmount) * 82))}%`;
          });
          activityChart.classList.remove("is-locked");
          activityChart.removeAttribute("data-state");
          activityChart.setAttribute("aria-label", "Recent account activity by transaction amount");
          activityChart.querySelector(".graph-caption small").textContent = `${transactions.length} recent transactions`;
        } else {
          activityChart.classList.add("is-locked");
          activityChart.dataset.state = "empty";
          activityChart.setAttribute("aria-label", "No account activity yet");
          activityChart.querySelector(".graph-caption small").textContent = "No activity yet";
        }
      }
    } catch {
      if (heroAccountPreview) heroAccountPreview.textContent = "Your overview is ready";
    }
  });

  const loginForm = document.querySelector("#login-form");
  const errorBox = document.querySelector("#login-error");
  const forgotPasswordLink = document.querySelector("#forgot-password");
  const forgotPasswordMessage = document.querySelector("#forgot-password-message");

  if (forgotPasswordLink && forgotPasswordMessage) {
    forgotPasswordLink.addEventListener("click", (event) => {
      event.preventDefault();
      forgotPasswordMessage.classList.add("visible");
      document.querySelector("#demo-id")?.focus();
    });
  }

  if (loginForm && errorBox) {
    authenticatedUser.then((user) => {
      if (user) window.location.href = "dashboard.html";
    });

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const userId = document.querySelector("#demo-id").value.trim();
      const password = document.querySelector("#demo-password").value;

      if (!userId || !password) {
        errorBox.textContent = "Please enter both your user ID and password.";
        errorBox.classList.add("visible");
        return;
      }

      const submitButton = loginForm.querySelector("button[type='submit']");
      submitButton.disabled = true;
      try {
        await requestJSON("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier: userId, password }),
        });
        window.location.href = "dashboard.html";
      } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.add("visible");
        submitButton.disabled = false;
      }
    });
  }

  const signupForm = document.querySelector("#signup-form");
  const signupMessage = document.querySelector("#signup-message");

  if (signupForm && signupMessage) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.querySelector("#signup-name").value.trim();
      const email = document.querySelector("#signup-email").value.trim();
      const phone = document.querySelector("#signup-phone").value.trim();
      const password = document.querySelector("#signup-password").value;
      const passwordConfirm = document.querySelector("#signup-password-confirm").value;

      if (!name || !email || !phone || !password || !passwordConfirm) {
        signupMessage.textContent = "Please complete all account details, including your password.";
        signupMessage.classList.add("visible", "is-error");
        return;
      }

      if (password.length < 12) {
        signupMessage.textContent = "Use a password with at least 12 characters.";
        signupMessage.classList.add("visible", "is-error");
        return;
      }

      if (password !== passwordConfirm) {
        signupMessage.textContent = "Your passwords do not match. Please try again.";
        signupMessage.classList.add("visible", "is-error");
        return;
      }

      const submitButton = signupForm.querySelector("button[type='submit']");
      submitButton.disabled = true;
      try {
        await requestJSON("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, phone, password }),
        });
        signupMessage.textContent = `Welcome, ${name}. Your demo banking workspace is ready.`;
        signupMessage.classList.add("visible");
        signupMessage.classList.remove("is-error");
        signupForm.classList.add("is-complete");
        window.location.href = "dashboard.html";
      } catch (error) {
        signupMessage.textContent = error.message;
        signupMessage.classList.add("visible", "is-error");
        submitButton.disabled = false;
      }
    });
  }

  const protectedPage = document.querySelector("[data-page]");
  const protectedPages = new Set([
    "accounts",
    "bills",
    "cards",
    "dashboard",
    "help",
    "investing",
    "loans",
    "profile",
    "search",
    "security",
    "statements",
    "transactions",
    "transfer",
  ]);

  if (protectedPage && protectedPages.has(protectedPage.dataset.page)) {
    document.documentElement.classList.add("auth-pending");
    authenticatedUser.then((user) => {
      if (!user) {
        window.location.href = "login.html";
        return;
      }
      document.documentElement.classList.remove("auth-pending");
    });
  }

  const logoutButton = document.querySelector("#logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.className = "logout-dialog";
      modal.innerHTML = `
        <div class="mock-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div class="modal-header">
            <h4 id="logout-title">Sign out?</h4>
            <button type="button" class="close-btn" data-action="cancel-logout" aria-label="Close logout confirmation">×</button>
          </div>
          <p>Your session will be cleared and you will return to the sign-in page.</p>
          <div class="review-actions">
            <button type="button" class="btn btn-ghost" data-action="cancel-logout">Cancel</button>
            <button type="button" class="btn btn-primary" data-action="confirm-logout">Confirm Logout</button>
          </div>
        </div>
      `;

      const closeModal = () => modal.remove();
      modal.querySelectorAll("[data-action='cancel-logout']").forEach((button) => {
        button.addEventListener("click", closeModal);
      });
      modal.querySelector("[data-action='confirm-logout']").addEventListener("click", async () => {
        try {
          await requestJSON("/api/auth/logout", { method: "POST" });
          window.location.href = "login.html";
        } catch (error) {
          modal.querySelector("p").textContent = error.message;
        }
      });
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
      });
      modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
      });

      document.body.appendChild(modal);
      modal.querySelector("[data-action='cancel-logout']").focus();
    });
  }

  const dashboardGreeting = document.querySelector("#dashboard-greeting");
  const dashboardDisclaimer = document.querySelector("#dashboard-disclaimer");
  const dashboardSnapshot = {
    inflow: document.querySelector("#metric-inflow"),
    outflow: document.querySelector("#metric-outflow"),
    investments: document.querySelector("#metric-investments"),
    loans: document.querySelector("#metric-loans"),
  };
  const accountSummary = document.querySelector("#account-summary-cards");
  const dashboardAccountDetails = document.querySelector("#dashboard-account-details");
  const dashboardCardVisual = document.querySelector("#dashboard-card-visual");
  const recentTransactions = document.querySelector("#recent-transactions");
  const notificationsList = document.querySelector("#notifications-list");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const loadJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  };

  const fallbackAccounts = [];
  const fallbackTransactions = [];
  const fallbackNotifications = [];
  const fallbackCards = [];
  const fallbackBillers = [];

  const setUIState = (element, state, message) => {
    if (!element) return;
    element.dataset.uiState = state;
    element.innerHTML = `<div class="ui-state ui-state-${state}" role="status">${message}</div>`;
  };

  const renderSummaryCards = (accounts) => {
    if (!accountSummary) return;

    accountSummary.innerHTML = "";

    if (!accounts || accounts.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = "No accounts available.";
      accountSummary.appendChild(emptyState);
      return;
    }

    accounts.forEach((account) => {
      const card = document.createElement("article");
      card.className = "dashboard-card";

      const label = document.createElement("p");
      label.className = "eyebrow eyebrow-dark";
      label.textContent = account.type;

      const amount = document.createElement("h3");
      amount.textContent = formatCurrency(account.balance);

      const meta = document.createElement("p");
      meta.textContent = `${account.name} • ${account.maskedNumber}`;

      card.append(label, amount, meta);
      accountSummary.appendChild(card);
    });
  };

  const renderAccountDetails = (accounts) => {
    if (!dashboardAccountDetails) return;
    dashboardAccountDetails.innerHTML = "";

    if (!accounts?.length) {
      dashboardAccountDetails.innerHTML = '<div class="empty-state">Account details are unavailable.</div>';
      return;
    }

    accounts.slice(0, 3).forEach((account) => {
      const row = document.createElement("div");
      row.className = "account-detail-row";

      const identity = document.createElement("div");
      identity.className = "account-detail-identity";
      const icon = document.createElement("span");
      icon.className = "account-detail-icon";
      icon.textContent = account.type.slice(0, 1);
      const name = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = account.name;
      const number = document.createElement("small");
      number.textContent = `${account.type} · ${account.maskedNumber}`;
      name.append(title, number);
      identity.append(icon, name);

      const balance = document.createElement("div");
      balance.className = "account-detail-balance";
      const amount = document.createElement("strong");
      amount.textContent = formatCurrency(account.balance);
      const status = document.createElement("small");
      status.textContent = `${account.status} · Available ${formatCurrency(account.availableBalance)}`;
      balance.append(amount, status);

      row.append(identity, balance);
      dashboardAccountDetails.appendChild(row);
    });
  };

  const renderDashboardCard = (cards) => {
    if (!dashboardCardVisual) return;
    const card = cards?.[0];
    if (!card) {
      dashboardCardVisual.innerHTML = '<div class="empty-state">No card is linked to this profile yet.</div>';
      return;
    }

    if (!card.isDemoCard) {
      const visual = document.createElement("div");
      visual.className = `wallet-card wallet-card--${card.cardType.toLowerCase()}`;
      const topline = document.createElement("div");
      topline.className = "wallet-card-topline";
      const type = document.createElement("span");
      type.textContent = `${card.cardType} · Reference only`;
      const mark = document.createElement("strong");
      mark.textContent = "K";
      topline.append(type, mark);
      const number = document.createElement("div");
      number.className = "wallet-card-number";
      number.textContent = `**** ${card.lastFour}`;
      const footer = document.createElement("div");
      footer.className = "wallet-card-bottomline";
      const label = document.createElement("span");
      label.textContent = card.label;
      const status = document.createElement("span");
      status.textContent = card.status;
      footer.append(label, status);
      visual.append(topline, number, footer);
      dashboardCardVisual.replaceChildren(visual);
      return;
    }

    dashboardCardVisual.innerHTML = `
      <div class="wallet-card wallet-card--${card.theme}">
        <div class="wallet-card-topline"><span>${card.cardType} · ${card.network}</span><strong>K</strong></div>
        <div class="wallet-card-chip" aria-hidden="true"></div>
        <div class="wallet-card-number">${card.maskedNumber}</div>
        <div class="wallet-card-bottomline">
          <span>${card.holderName}</span>
          <span>VALID THRU ${card.expiry}</span>
        </div>
      </div>
      <div class="wallet-card-meta">
        <div><span>${card.name}</span><strong>${formatCurrency(card.balance)}</strong></div>
        <small>${card.status} · ${card.rewardPoints.toLocaleString("en-IN")} reward points</small>
      </div>
    `;
  };

  const renderTransactions = (transactions) => {
    if (!recentTransactions) return;

    recentTransactions.innerHTML = "";

    if (!transactions || transactions.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-state";
      emptyItem.textContent = "No transaction history for this account.";
      recentTransactions.appendChild(emptyItem);
      return;
    }

    transactions.slice(0, 5).forEach((transaction) => {
      const item = document.createElement("li");
      item.className = "transaction-item";

      const textWrap = document.createElement("div");
      textWrap.className = "transaction-copy";

      const title = document.createElement("strong");
      title.textContent = transaction.description;

      const meta = document.createElement("small");
      meta.textContent = transaction.date;

      textWrap.append(title, meta);

      const amount = document.createElement("span");
      const signedAmount = transaction.type === "Credit" ? "+" : "-";
      amount.className = `transaction-amount ${transaction.type === "Credit" ? "credit" : "debit"}`;
      amount.textContent = `${signedAmount}${formatCurrency(transaction.amount)}`;

      item.append(textWrap, amount);
      recentTransactions.appendChild(item);
    });
  };

  const renderNotifications = (notifications) => {
    if (!notificationsList) return;

    notificationsList.innerHTML = "";

    if (!notifications || notifications.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-state";
      emptyItem.textContent = "You are all caught up. No notifications yet.";
      notificationsList.appendChild(emptyItem);
      return;
    }

    notifications.slice(0, 4).forEach((notification) => {
      const item = document.createElement("li");
      item.className = "notification-item";

      const badge = document.createElement("span");
      badge.className = `notification-badge ${notification.type}`;
      badge.textContent = notification.type;

      const textWrap = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = notification.title;
      const meta = document.createElement("small");
      meta.textContent = notification.message;

      textWrap.append(title, meta);
      item.append(badge, textWrap);
      notificationsList.appendChild(item);
    });
  };

  const renderFinancialSnapshot = (transactions, investments, loans) => {
    const month = new Date().toISOString().slice(0, 7);
    const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(month));
    const inflow = monthTransactions
      .filter((transaction) => transaction.type === "Credit")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const outflow = monthTransactions
      .filter((transaction) => transaction.type === "Debit")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const investmentValue = investments.reduce((sum, investment) => sum + investment.value, 0);
    const loanBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);

    if (dashboardSnapshot.inflow) dashboardSnapshot.inflow.textContent = formatCurrency(inflow);
    if (dashboardSnapshot.outflow) dashboardSnapshot.outflow.textContent = formatCurrency(outflow);
    if (dashboardSnapshot.investments) dashboardSnapshot.investments.textContent = formatCurrency(investmentValue);
    if (dashboardSnapshot.loans) dashboardSnapshot.loans.textContent = formatCurrency(loanBalance);
  };

  if (dashboardGreeting || dashboardDisclaimer || accountSummary || dashboardAccountDetails || dashboardCardVisual || recentTransactions || notificationsList || Object.values(dashboardSnapshot).some(Boolean)) {
    setUIState(accountSummary, "loading", "Loading accounts...");
    setUIState(dashboardAccountDetails, "loading", "Loading account details...");
    setUIState(dashboardCardVisual, "loading", "Loading card details...");
    setUIState(recentTransactions, "loading", "Loading recent activity...");
    setUIState(notificationsList, "loading", "Loading notifications...");
    (async () => {
      try {
        const [customer, accounts, cards, transactions, notifications, investments, loans] = await Promise.all([
          loadJSON("../data/demo-user.json"),
          loadJSON("../data/demo-accounts.json"),
          requestJSON("/api/cards"),
          loadJSON("../data/demo-transactions.json"),
          loadJSON("../data/demo-notifications.json"),
          loadJSON("../data/demo-investments.json"),
          loadJSON("../data/demo-loans.json"),
        ]);

        if (dashboardGreeting && customer?.displayName) {
          dashboardGreeting.textContent = `Welcome back, ${customer.displayName.split(" ")[0]}`;
        }

        if (dashboardDisclaimer) {
          dashboardDisclaimer.textContent = customer?.isDemo
            ? "Seeded fictional records for demonstration. No real bank account is connected."
            : "Your profile is active. New demo accounts start at ₹0 until account data is linked.";
        }

        renderSummaryCards(accounts);
        renderAccountDetails(accounts);
        renderDashboardCard(cards);
        renderTransactions(transactions);
        renderNotifications(notifications);
        renderFinancialSnapshot(transactions, investments, loans);
      } catch (error) {
        if (dashboardDisclaimer) {
          dashboardDisclaimer.textContent = "Your account overview is ready. Recent activity will update shortly.";
        }
        renderSummaryCards(fallbackAccounts);
        renderAccountDetails(fallbackAccounts);
        renderDashboardCard(fallbackCards);
        renderTransactions(fallbackTransactions);
        renderNotifications(fallbackNotifications);
        renderFinancialSnapshot([], [], []);
      }
    })();
  }

  const contactForm = document.querySelector("#contact-form");
  const successMessage = document.querySelector("#success-message");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        successMessage.classList.remove("visible");
        return;
      }

      const formData = new FormData(contactForm);
      try {
        const result = await requestJSON("/api/contact", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(formData.entries())),
        });
        successMessage.textContent = result.message;
        successMessage.classList.add("visible");
        successMessage.classList.remove("is-error");
        contactForm.reset();
      } catch (error) {
        successMessage.textContent = error.message;
        successMessage.classList.add("visible", "is-error");
      }
    });
  }

  const accountsGrid = document.querySelector("#accounts-grid");

  if (accountsGrid) {
    setUIState(accountsGrid, "loading", "Loading accounts...");
    (async () => {
      try {
        const accounts = await loadJSON("../data/demo-accounts.json");

        if (!accounts || accounts.length === 0) {
          accountsGrid.innerHTML = '<div class="empty-state">No accounts available.</div>';
          return;
        }

        accountsGrid.innerHTML = accounts
          .map(
            (account) => `
              <article class="account-card">
                <div class="account-top">
                  <p class="account-type">${account.type}</p>
                  <span class="account-tag">${account.status}</span>
                </div>
                <div>
                  <h3>${formatCurrency(account.balance)}</h3>
                  <p class="account-meta">${account.name}</p>
                </div>
                <p class="account-meta">${account.maskedNumber}</p>
                <div class="account-balance-row">
                  <span>Available</span>
                  <strong>${formatCurrency(account.availableBalance)}</strong>
                </div>
                <div class="account-footer">
                  <span class="account-meta">${account.currency}</span>
                  <button type="button" class="btn btn-secondary" data-account-id="${account.id}">View Details</button>
                </div>
              </article>
            `
          )
          .join("");

        accountsGrid.querySelectorAll("[data-account-id]").forEach((button) => {
          button.addEventListener("click", () => {
            const account = accounts.find((item) => item.id === button.dataset.accountId);
            if (!account) return;

            const modal = document.createElement("div");
            modal.className = "transaction-modal";
            modal.innerHTML = `
              <div class="mock-modal" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
                <div class="modal-header">
                  <h4 id="account-dialog-title">${account.name}</h4>
                  <button type="button" class="close-btn" aria-label="Close account details">×</button>
                </div>
                <p><strong>Type:</strong> ${account.type}</p>
                <p><strong>Account:</strong> ${account.maskedNumber}</p>
                <p><strong>Balance:</strong> ${formatCurrency(account.balance)}</p>
                <p><strong>Available:</strong> ${formatCurrency(account.availableBalance)}</p>
              </div>
            `;

            const closeButton = modal.querySelector(".close-btn");
            const closeModal = () => modal.remove();
            closeButton.addEventListener("click", closeModal);
            modal.addEventListener("click", (event) => {
              if (event.target === modal) closeModal();
            });
            modal.addEventListener("keydown", (event) => {
              if (event.key === "Escape") closeModal();
            });

            document.body.appendChild(modal);
            closeButton.focus();
          });
        });
      } catch (error) {
        accountsGrid.innerHTML = '<div class="empty-state">Account data could not be loaded.</div>';
      }
    })();
  }

  const cardsGrid = document.querySelector("#cards-grid");

  if (cardsGrid) {
    setUIState(cardsGrid, "loading", "Loading cards...");
    (async () => {
      try {
        const cards = await requestJSON("/api/cards");

        if (!cards || cards.length === 0) {
          cardsGrid.innerHTML = `
            <div class="empty-state">
              <span class="cards-empty-mark" aria-hidden="true">K</span>
              <strong class="cards-empty-title">Your wallet starts here.</strong>
              <span>No cards on file yet. Add a card reference below.</span>
              <a class="cards-empty-link" href="#card-add-form">Add your first card &rarr;</a>
            </div>
          `;
          return;
        }

        cardsGrid.innerHTML = cards
          .filter((card) => card.isDemoCard)
          .map(
            (card) => `
              <article class="card-showcase">
                <div class="card-visual card-visual--${card.theme || "credit"}">
                  <div class="card-meta-line">
                    <span>${card.cardType} · ${card.network}</span>
                    <span>${card.status}</span>
                  </div>
                  <div class="card-chip"></div>
                  <div class="card-contactless" aria-hidden="true">)))</div>
                  <div class="card-number">${card.maskedNumber}</div>
                  <div class="card-footer-row">
                    <span>${card.holderName}</span>
                    <span>${card.expiry}</span>
                  </div>
                </div>

                <div>
                  <div class="card-section-title">Card overview</div>
                  <h3>${card.name}</h3>
                </div>

                <div class="card-detail-rows">
                  <div class="metric-box">
                    <span>Current balance</span>
                    <strong>${formatCurrency(card.balance)}</strong>
                  </div>
                  <div class="metric-box">
                    <span>Available credit</span>
                    <strong>${formatCurrency(card.availableCredit)}</strong>
                  </div>
                  <div class="metric-box">
                    <span>Payment due</span>
                    <strong>${formatCurrency(card.paymentDue)}</strong>
                  </div>
                  <div class="metric-box">
                    <span>Reward points</span>
                    <strong>${card.rewardPoints.toLocaleString()}</strong>
                  </div>
                </div>

                <div>
                  <div class="card-section-title">Benefits</div>
                  <ul class="card-list">
                    ${card.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
                  </ul>
                </div>

                <div>
                  <div class="card-section-title">Rewards</div>
                  <ul class="card-list">
                    ${card.rewards.map((reward) => `<li>${reward}</li>`).join("")}
                  </ul>
                </div>

                <div>
                  <div class="card-section-title">Recent transactions</div>
                  <ul class="card-list">
                    ${card.recentTransactions
                      .map(
                        (transaction) =>
                          `<li>${transaction.description} — ${transaction.type === "Credit" ? "+" : "-"}${formatCurrency(transaction.amount)} (${transaction.date})</li>`
                      )
                      .join("")}
                  </ul>
                </div>
              </article>
            `
          )
          .join("");

        cards.filter((card) => !card.isDemoCard).forEach((card) => {
          const article = document.createElement("article");
          article.className = "card-showcase";
          const visual = document.createElement("div");
          visual.className = `card-visual card-visual--${card.cardType.toLowerCase()}`;
          const topline = document.createElement("div");
          topline.className = "card-meta-line";
          const type = document.createElement("span");
          type.textContent = card.cardType;
          const status = document.createElement("span");
          status.textContent = card.status;
          topline.append(type, status);
          const number = document.createElement("div");
          number.className = "card-number";
          number.textContent = `**** ${card.lastFour}`;
          const footer = document.createElement("div");
          footer.className = "card-footer-row";
          const label = document.createElement("span");
          label.textContent = card.label;
          const note = document.createElement("span");
          note.textContent = "Reference only";
          footer.append(label, note);
          visual.append(topline, number, footer);
          const description = document.createElement("p");
          description.className = "form-intro";
          description.textContent = "This local reference is not verified and cannot be used for payments.";
          article.append(visual, description);
          cardsGrid.append(article);
        });
      } catch (error) {
        cardsGrid.innerHTML = '<div class="empty-state">Card data could not be loaded.</div>';
      }
    })();
  }

  const cardAddForm = document.querySelector("#card-add-form");
  const cardAddMessage = document.querySelector("#card-add-note");

  if (cardAddForm && cardAddMessage) {
    cardAddForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!cardAddForm.reportValidity()) return;

      const submitButton = cardAddForm.querySelector("button[type='submit']");
      submitButton.disabled = true;
      try {
        const card = await requestJSON("/api/cards", {
          method: "POST",
          body: JSON.stringify({
            cardType: cardAddForm.elements.cardType.value,
            label: cardAddForm.elements.label.value.trim(),
            lastFour: cardAddForm.elements.lastFour.value.trim(),
          }),
        });
        cardAddMessage.textContent = `Card reference ending in ${card.card.lastFour} was added. It is not verified or enabled for payments.`;
        cardAddMessage.classList.add("visible");
        cardAddMessage.classList.remove("is-error");
        cardAddForm.reset();

        const cards = await requestJSON("/api/cards");
        const newCard = cards.find((item) => item.id === card.card.id);
        if (newCard) {
          const article = document.createElement("article");
          article.className = "card-showcase";
          const visual = document.createElement("div");
          visual.className = `card-visual card-visual--${newCard.cardType.toLowerCase()}`;
          const topline = document.createElement("div");
          topline.className = "card-meta-line";
          const type = document.createElement("span");
          type.textContent = newCard.cardType;
          const status = document.createElement("span");
          status.textContent = newCard.status;
          topline.append(type, status);
          const number = document.createElement("div");
          number.className = "card-number";
          number.textContent = `**** ${newCard.lastFour}`;
          const footer = document.createElement("div");
          footer.className = "card-footer-row";
          const label = document.createElement("span");
          label.textContent = newCard.label;
          const referenceOnly = document.createElement("span");
          referenceOnly.textContent = "Reference only";
          footer.append(label, referenceOnly);
          visual.append(topline, number, footer);
          const description = document.createElement("p");
          description.className = "form-intro";
          description.textContent = "This local reference is not verified and cannot be used for payments.";
          article.append(visual, description);
          cardsGrid.querySelector(".empty-state")?.remove();
          cardsGrid.append(article);
        }
      } catch (error) {
        cardAddMessage.textContent = error.message;
        cardAddMessage.classList.add("visible", "is-error");
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  const loansGrid = document.querySelector("#loans-grid");
  const activeLoans = document.querySelector("#active-loans");
  const activeLoansCount = document.querySelector("#active-loans-count");

  if (loansGrid) {
    setUIState(loansGrid, "loading", "Loading sample loan categories...");
    (async () => {
      try {
        const [{ products }, { applications }] = await Promise.all([
          requestJSON("/api/loan-products"),
          requestJSON("/api/loan-applications"),
        ]);
        const requestedProducts = new Set(applications.map((application) => application.productId));
        loansGrid.innerHTML = "";

        products.forEach((product) => {
          const article = document.createElement("article");
          article.className = "loan-card";
          const header = document.createElement("div");
          header.className = "loan-header";
          const type = document.createElement("p");
          type.className = "loan-type";
          type.textContent = product.type;
          const sampleTag = document.createElement("span");
          sampleTag.className = "account-tag";
          sampleTag.textContent = "Sample category";
          header.append(type, sampleTag);
          const title = document.createElement("h3");
          title.textContent = product.name;
          const description = document.createElement("p");
          description.textContent = product.description;
          const status = document.createElement("p");
          status.className = "loan-request-status";
          status.setAttribute("aria-live", "polite");
          const button = document.createElement("button");
          button.type = "button";
          button.className = "btn btn-primary loan-apply-button";
          button.dataset.productId = product.id;
          button.textContent = requestedProducts.has(product.id) ? "Request received" : "Request information";
          button.disabled = requestedProducts.has(product.id);
          button.addEventListener("click", async () => {
            button.disabled = true;
            try {
              const result = await requestJSON("/api/loan-applications", {
                method: "POST",
                body: JSON.stringify({ productId: product.id }),
              });
              button.textContent = "Request received";
              status.textContent = result.message;
            } catch (error) {
              button.disabled = false;
              status.textContent = error.message;
            }
          });
          article.append(header, title, description, status, button);
          loansGrid.append(article);
        });
      } catch (error) {
        loansGrid.innerHTML = '<div class="empty-state">Loan categories could not be loaded.</div>';
      }
    })();
  }

  if (activeLoans) {
    const renderActiveLoans = (loans) => {
      const active = loans.filter((loan) => loan.status === "Active");
      if (activeLoansCount) activeLoansCount.textContent = `${active.length} active`;
      if (active.length === 0) {
        activeLoans.innerHTML = '<p class="empty-state">No active loans on this profile.</p>';
        return;
      }
      activeLoans.innerHTML = active.map((loan) => {
        const paidPercent = Math.round((loan.paid / loan.principal) * 100);
        return `<article class="active-loan-row"><div class="active-loan-icon">${loan.type.slice(0, 1)}</div><div class="active-loan-main"><strong>${loan.name}</strong><small>${loan.type} · ${loan.interestRate}% interest</small><div class="loan-progress"><span><i style="width:${paidPercent}%"></i></span><small>${paidPercent}% repaid</small></div></div><div class="active-loan-balance"><small>Remaining</small><strong>${formatCurrency(loan.balance)}</strong><span>of ${formatCurrency(loan.principal)}</span></div></article>`;
      }).join("");
    };
    (async () => {
      let loans;
      try { loans = await loadJSON("../data/demo-loans.json"); } catch (error) { loans = fallbackLoans; }
      renderActiveLoans(loans);
    })();
  }

  const investmentCards = document.querySelector("#investment-cards");
  const portfolioTotal = document.querySelector("#portfolio-total");
  const portfolioChange = document.querySelector("#portfolio-change");
  const portfolioRisk = document.querySelector("#portfolio-risk");
  const allocationGrid = document.querySelector("#allocation-grid");

  if (investmentCards || portfolioTotal || portfolioChange || portfolioRisk || allocationGrid) {
    setUIState(investmentCards, "loading", "Loading portfolio data...");
    setUIState(allocationGrid, "loading", "Loading allocation data...");
    (async () => {
      try {
        const investments = await loadJSON("../data/demo-investments.json");

        if (!investments || investments.length === 0) {
          if (investmentCards) {
            investmentCards.innerHTML = '<div class="empty-state">No investment data available.</div>';
          }
          if (allocationGrid) {
            allocationGrid.innerHTML = '<div class="empty-state">Allocation details are unavailable.</div>';
          }
          return;
        }

        const totalValue = investments.reduce((sum, item) => sum + item.value, 0);
        const weightedChange = investments.reduce((sum, item) => sum + (item.value * item.changePercent), 0) / totalValue;

        if (portfolioTotal) {
          portfolioTotal.textContent = formatCurrency(totalValue);
        }

        if (portfolioChange) {
          portfolioChange.textContent = `${weightedChange.toFixed(1)}%`;
        }

        if (portfolioRisk) {
          portfolioRisk.textContent = investments.some((item) => item.changePercent > 10) ? "Growth Focus" : "Balanced";
        }

        if (investmentCards) {
          investmentCards.innerHTML = investments
            .map(
              (investment) => `
                <article class="investment-card">
                  <div class="investment-header">
                    <div>
                      <p class="loan-type">${investment.type}</p>
                      <h3>${investment.name}</h3>
                    </div>
                    <span class="account-tag ${investment.status === "Growing" ? "positive" : "neutral"}">${investment.status}</span>
                  </div>

                  <div class="investment-value-row">
                    <span class="investment-value">${formatCurrency(investment.value)}</span>
                    <span class="investment-change ${investment.changePercent >= 0 ? "positive" : "negative"}">${investment.changePercent >= 0 ? "+" : ""}${investment.changePercent.toFixed(1)}%</span>
                  </div>

                  <p class="investment-note">This is an educational portfolio example for the Bank of Kubera frontend. No real markets or brokerage actions are connected.</p>
                </article>
              `
            )
            .join("");
        }

        if (allocationGrid) {
          allocationGrid.innerHTML = investments
            .map((investment) => {
              const percentage = ((investment.value / totalValue) * 100).toFixed(1);
              return `
                <div class="allocation-item">
                  <div class="allocation-label-row">
                    <span>${investment.name}</span>
                    <strong>${percentage}%</strong>
                  </div>
                  <div class="allocation-bar">
                    <span style="width:${percentage}%"></span>
                  </div>
                </div>
              `;
            })
            .join("");
        }
      } catch (error) {
        if (investmentCards) {
          investmentCards.innerHTML = '<div class="empty-state">Investment data could not be loaded.</div>';
        }
        if (allocationGrid) {
          allocationGrid.innerHTML = '<div class="empty-state">Allocation data could not be loaded.</div>';
        }
      }
    })();
  }

  const profileForm = document.querySelector("#profile-form");
  const profileEdit = document.querySelector("#profile-edit");
  const profileSave = document.querySelector("#profile-save");
  const profileCancel = document.querySelector("#profile-cancel");
  const profileStatus = document.querySelector("#profile-status");
  const settingsStatus = document.querySelector("#settings-status");

  if (profileForm) {
    const profileFields = Array.from(profileForm.querySelectorAll("input"));
    let savedProfile = {};

    const setProfileStatus = (message, isError = false) => {
      if (!profileStatus) return;
      profileStatus.textContent = message;
      profileStatus.classList.toggle("is-error", isError);
    };

    const setEditing = (isEditing) => {
      profileFields.forEach((field) => {
        field.readOnly = !isEditing;
      });
      if (profileSave) profileSave.disabled = !isEditing;
      if (profileCancel) profileCancel.disabled = !isEditing;
      if (profileEdit) profileEdit.disabled = isEditing;
    };

    const captureProfile = () => Object.fromEntries(profileFields.map((field) => [field.name, field.value]));
    const restoreProfile = () => {
      profileFields.forEach((field) => {
        field.value = savedProfile[field.name] || "";
      });
    };

    (async () => {
      try {
        const customer = await loadJSON("../data/demo-user.json");
        const profileValues = {
          name: customer.displayName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        };

        profileFields.forEach((field) => {
          field.value = profileValues[field.name] || "";
        });
        savedProfile = captureProfile();
        setEditing(false);
      } catch (error) {
        setProfileStatus("Placeholder profile data could not be loaded.", true);
      }
    })();

    profileEdit?.addEventListener("click", () => {
      setEditing(true);
      setProfileStatus("");
    });

    profileCancel?.addEventListener("click", () => {
      restoreProfile();
      setEditing(false);
      setProfileStatus("Changes cancelled. Placeholder details were restored.");
    });

    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!profileForm.checkValidity()) {
        profileForm.reportValidity();
        setProfileStatus("Please complete all profile fields before saving.", true);
        return;
      }

      savedProfile = captureProfile();
      setEditing(false);
      setProfileStatus("Profile changes saved in this session.");
    });
  }

  const settingControls = document.querySelectorAll("#preferred-language, .settings-list input[type='checkbox']");
  settingControls.forEach((control) => {
    control.addEventListener("change", () => {
      if (settingsStatus) {
          settingsStatus.textContent = "Preference updated in this session.";
        settingsStatus.classList.remove("is-error");
      }
    });
  });

  const twoFactorToggle = document.querySelector("#two-factor-toggle");
  const twoFactorStatus = document.querySelector("#two-factor-status");
  const loginActivityList = document.querySelector("#login-activity-list");

  twoFactorToggle?.addEventListener("change", () => {
    if (!twoFactorStatus) return;
    twoFactorStatus.textContent = twoFactorToggle.checked
      ? "Verification prompts are shown as enabled. No real security setting was changed."
      : "Verification prompts are shown as disabled. No real security setting was changed.";
  });

  if (loginActivityList) {
    setUIState(loginActivityList, "loading", "Loading login activity...");
    (async () => {
      try {
        const activity = await loadJSON("../data/demo-login-activity.json");

        if (!activity || activity.length === 0) {
          loginActivityList.innerHTML = '<div class="empty-state">No login activity available.</div>';
          return;
        }

        loginActivityList.innerHTML = activity
          .map(
            (entry) => `
              <article class="activity-item">
                <div>
                  <strong>${entry.device}</strong>
                  <span>${entry.location} · ${new Date(entry.timestamp).toLocaleString("en-IN")}</span>
                </div>
                <span class="notification-badge success">${entry.status}</span>
              </article>
            `
          )
          .join("");
      } catch (error) {
        loginActivityList.innerHTML = '<div class="empty-state">Login activity could not be loaded.</div>';
      }
    })();
  }

  const helpFaqList = document.querySelector("#help-faq-list");

  if (helpFaqList) {
    setUIState(helpFaqList, "loading", "Loading help topics...");
    (async () => {
      try {
        const helpItems = await loadJSON("../data/demo-help.json");
        const renderHelp = () => {
          if (!helpItems.length) {
            helpFaqList.innerHTML = '<div class="empty-state">No help topics are available right now.</div>';
            return;
          }

          helpFaqList.innerHTML = helpItems
            .map(
              (item) => `
                <article class="faq-item">
                  <button type="button" class="faq-question" aria-expanded="false">
                    <span><small>${item.category}</small>${item.question}</span>
                    <strong aria-hidden="true">+</strong>
                  </button>
                  <div class="faq-answer" hidden>${item.answer}</div>
                </article>
              `
            )
            .join("");

          helpFaqList.querySelectorAll(".faq-question").forEach((button) => {
            button.addEventListener("click", () => {
              const answer = button.parentElement.querySelector(".faq-answer");
              const isExpanded = button.getAttribute("aria-expanded") === "true";
              button.setAttribute("aria-expanded", String(!isExpanded));
              button.querySelector("strong").textContent = isExpanded ? "+" : "−";
              answer.hidden = isExpanded;
            });
          });
        };

        renderHelp();
      } catch (error) {
        helpFaqList.innerHTML = '<div class="empty-state">Help content could not be loaded.</div>';
      }
    })();
  }

  const complaintForm = document.querySelector("#complaint-form");
  const complaintStatus = document.querySelector("#complaint-status");

  if (complaintForm && complaintStatus) {
    complaintForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const transactionId = document.querySelector("#complaint-transaction").value.trim();
      const reason = document.querySelector("#complaint-reason").value;
      const details = document.querySelector("#complaint-details").value.trim();

      if (!transactionId || !reason || !details) {
        complaintStatus.textContent = "Please complete the transaction ID, issue type, and details.";
        complaintStatus.classList.add("is-error");
        return;
      }

      complaintStatus.textContent = `Complaint ${transactionId.toUpperCase()} has been submitted for review.`;
      complaintStatus.classList.remove("is-error");
      complaintForm.reset();
    });
  }

  const supportBotForm = document.querySelector("#support-bot-form");
  const supportBotInput = document.querySelector("#support-bot-input");
  const supportBotMessages = document.querySelector("#support-bot-messages");
  const botPrompts = document.querySelectorAll("[data-bot-prompt]");

  if (supportBotForm && supportBotInput && supportBotMessages) {
    const getBotReply = (message) => {
      const query = message.toLowerCase();
      if (query.includes("report") || query.includes("transaction") || query.includes("complaint")) {
        return "Open Raise a complaint, add the transaction ID and issue details, then submit it for review.";
      }
      if (query.includes("transfer")) {
        return "Most transfers appear in recent activity after they are processed. Check the Transfers page for the latest status.";
      }
      if (query.includes("password") || query.includes("login")) {
        return "Use Forgot password on the sign-in page, or contact support if you need more help accessing your account.";
      }
      if (query.includes("payment") || query.includes("card")) {
        return "For a card or payment issue, include the transaction ID in your complaint so the team can find it quickly.";
      }
      return "I can help with transactions, transfers, payments, cards, and login questions.";
    };

    const sendBotMessage = (message) => {
      const cleanMessage = message.trim();
      if (!cleanMessage) return;

      const appendMessage = (text, messageType) => {
        const messageElement = document.createElement("div");
        messageElement.className = `bot-message ${messageType}`;
        messageElement.textContent = text;
        supportBotMessages.appendChild(messageElement);
      };

      appendMessage(cleanMessage, "bot-message--user");
      appendMessage(getBotReply(cleanMessage), "bot-message--bot");
      supportBotMessages.scrollTop = supportBotMessages.scrollHeight;
    };

    supportBotForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendBotMessage(supportBotInput.value);
      supportBotInput.value = "";
      supportBotInput.focus();
    });

    botPrompts.forEach((prompt) => {
      prompt.addEventListener("click", () => sendBotMessage(prompt.dataset.botPrompt));
    });
  }

  const globalSearchForm = document.querySelector("#global-search-form");
  const globalSearchInput = document.querySelector("#global-search-input");
  const globalSearchClear = document.querySelector("#global-search-clear");
  const globalSearchResults = document.querySelector("#global-search-results");
  const globalSearchStatus = document.querySelector("#global-search-status");

  if (globalSearchForm && globalSearchInput && globalSearchResults) {
    setUIState(globalSearchResults, "loading", "Loading search records...");
    (async () => {
      try {
        const records = await loadJSON("../data/demo-search.json");

        const renderSearchResults = () => {
          const query = globalSearchInput.value.trim().toLowerCase();

          if (!query) {
            globalSearchStatus.textContent = "Enter a topic to search banking.";
            globalSearchResults.innerHTML = '<div class="empty-state">Search accounts, cards, loans, transfers, security, or help.</div>';
            return;
          }

          const matches = records.filter((record) => {
            const searchableText = `${record.category} ${record.title} ${record.description}`.toLowerCase();
            return searchableText.includes(query);
          });

          globalSearchStatus.textContent = `${matches.length} ${matches.length === 1 ? "result" : "results"} found`;

          if (!matches.length) {
            globalSearchResults.innerHTML = '<div class="empty-state">No results found. Try a broader search term.</div>';
            return;
          }

          const grouped = matches.reduce((groups, record) => {
            groups[record.category] = groups[record.category] || [];
            groups[record.category].push(record);
            return groups;
          }, {});

          globalSearchResults.innerHTML = Object.entries(grouped)
            .map(
              ([category, categoryRecords]) => `
                <section class="search-result-group">
                  <div class="search-result-heading">
                    <p class="eyebrow eyebrow-dark">${category}</p>
                    <span>${categoryRecords.length} ${categoryRecords.length === 1 ? "result" : "results"}</span>
                  </div>
                  <div class="search-result-list">
                    ${categoryRecords
                      .map(
                        (record) => `
                          <a class="search-result-card" href="${record.page}">
                            <span>
                              <strong>${record.title}</strong>
                              <span>${record.description}</span>
                            </span>
                            <span class="search-result-arrow" aria-hidden="true">→</span>
                          </a>
                        `
                      )
                      .join("")}
                  </div>
                </section>
              `
            )
            .join("");
        };

        globalSearchForm.addEventListener("submit", (event) => {
          event.preventDefault();
          renderSearchResults();
        });
        globalSearchInput.addEventListener("input", renderSearchResults);
        globalSearchClear.addEventListener("click", () => {
          globalSearchInput.value = "";
          renderSearchResults();
          globalSearchInput.focus();
        });

        renderSearchResults();
      } catch (error) {
        globalSearchResults.innerHTML = '<div class="empty-state">Search records could not be loaded.</div>';
        globalSearchStatus.textContent = "Search is currently unavailable.";
      }
    })();
  }

  const transactionSearch = document.querySelector("#transaction-search");
  const transactionAccountFilter = document.querySelector("#transaction-account-filter");
  const transactionTypeFilter = document.querySelector("#transaction-type-filter");
  const transactionDateFilter = document.querySelector("#transaction-date-filter");
  const transactionsTableWrap = document.querySelector("#transactions-table-wrap");

  if (transactionsTableWrap) {
    setUIState(transactionsTableWrap, "loading", "Loading transactions...");
    (async () => {
      try {
        const [accounts, transactions] = await Promise.all([
          loadJSON("../data/demo-accounts.json"),
          loadJSON("../data/demo-transactions.json")
        ]);

        const accountOptions = accounts
          .map((account) => `<option value="${account.id}">${account.type}</option>`)
          .join("");

        if (transactionAccountFilter) {
          transactionAccountFilter.insertAdjacentHTML("beforeend", accountOptions);
        }

        const renderTransactions = () => {
          const searchText = transactionSearch?.value.trim().toLowerCase() || "";
          const accountValue = transactionAccountFilter?.value || "all";
          const typeValue = transactionTypeFilter?.value || "all";
          const dateValue = transactionDateFilter?.value || "";

          const filtered = transactions.filter((transaction) => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchText);
            const matchesAccount = accountValue === "all" || transaction.accountId === accountValue;
            const matchesType = typeValue === "all" || transaction.type === typeValue;
            const matchesDate = !dateValue || transaction.date === dateValue;
            return matchesSearch && matchesAccount && matchesType && matchesDate;
          });

          if (!filtered.length) {
            transactionsTableWrap.innerHTML = '<div class="empty-state">No matching transactions found for the selected filters.</div>';
            return;
          }

          transactionsTableWrap.innerHTML = `
            <table class="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${filtered
                  .map((transaction) => {
                    const debit = transaction.type === "Debit" ? formatCurrency(transaction.amount) : "—";
                    const credit = transaction.type === "Credit" ? formatCurrency(transaction.amount) : "—";
                    const balance = formatCurrency(250000 + (transaction.type === "Credit" ? transaction.amount : -transaction.amount));
                    const typeClass = transaction.type === "Credit" ? "credit" : "debit";

                    return `
                      <tr>
                        <td>${transaction.date}</td>
                        <td>${transaction.description}</td>
                        <td><span class="transaction-status ${typeClass}">${transaction.type}</span></td>
                        <td class="${transaction.type === "Debit" ? "amount-negative" : ""}">${debit}</td>
                        <td class="${transaction.type === "Credit" ? "amount-positive" : ""}">${credit}</td>
                        <td>${balance}</td>
                        <td><button type="button" class="transaction-detail-btn" data-transaction-id="${transaction.id}">Details</button></td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          `;

          document.querySelectorAll(".transaction-detail-btn").forEach((button) => {
            button.addEventListener("click", () => {
              const selected = transactions.find((item) => item.id === button.dataset.transactionId);
              if (!selected) return;

              const modal = document.createElement("div");
              modal.className = "transaction-modal";
              modal.innerHTML = `
                <div class="mock-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-dialog-title">
                  <div class="modal-header">
                    <h4 id="transaction-dialog-title">Transaction details</h4>
                    <button type="button" class="close-btn" aria-label="Close transaction details">×</button>
                  </div>
                  <p><strong>Description:</strong> ${selected.description}</p>
                  <p><strong>Date:</strong> ${selected.date}</p>
                  <p><strong>Type:</strong> ${selected.type}</p>
                  <p><strong>Amount:</strong> ${formatCurrency(selected.amount)}</p>
                  <p><strong>Status:</strong> ${selected.status}</p>
                </div>
              `;

              const closeButton = modal.querySelector(".close-btn");
              closeButton.addEventListener("click", () => modal.remove());
              modal.addEventListener("click", (event) => {
                if (event.target === modal) modal.remove();
              });
              modal.addEventListener("keydown", (event) => {
                if (event.key === "Escape") modal.remove();
              });

              document.body.appendChild(modal);
              closeButton.focus();
            });
          });
        };

        [transactionSearch, transactionAccountFilter, transactionTypeFilter, transactionDateFilter].forEach((field) => {
          field?.addEventListener("input", renderTransactions);
          field?.addEventListener("change", renderTransactions);
        });

        renderTransactions();
      } catch (error) {
        transactionsTableWrap.innerHTML = '<div class="empty-state">Transaction data could not be loaded.</div>';
      }
    })();
  }

  const statementAccount = document.querySelector("#statement-account");
  const statementPeriod = document.querySelector("#statement-period");
  const statementTable = document.querySelector("#statement-table");
  const statementDownload = document.querySelector("#statement-download");
  const statementStatus = document.querySelector("#statement-status");

  if (statementAccount && statementPeriod && statementTable) {
    setUIState(statementTable, "loading", "Loading statement...");
    (async () => {
      try {
        const [accounts, transactions] = await Promise.all([
          loadJSON("../data/demo-accounts.json"),
          loadJSON("../data/demo-transactions.json")
        ]);

        statementAccount.innerHTML = accounts
          .map((account) => `<option value="${account.id}">${account.type} — ${account.maskedNumber}</option>`)
          .join("");

        const renderStatement = () => {
          const selectedAccount = accounts.find((account) => account.id === statementAccount.value);
          const period = statementPeriod.value;
          const filtered = transactions.filter((transaction) => transaction.accountId === statementAccount.value && transaction.date.startsWith(period));
          const credits = filtered.filter((item) => item.type === "Credit").reduce((sum, item) => sum + item.amount, 0);
          const debits = filtered.filter((item) => item.type === "Debit").reduce((sum, item) => sum + item.amount, 0);
          const closing = selectedAccount ? selectedAccount.balance : 0;
          const opening = closing - credits + debits;

          document.querySelector("#statement-opening").textContent = formatCurrency(opening);
          document.querySelector("#statement-credits").textContent = formatCurrency(credits);
          document.querySelector("#statement-debits").textContent = formatCurrency(debits);
          document.querySelector("#statement-closing").textContent = formatCurrency(closing);

          if (!filtered.length) {
            statementTable.innerHTML = '<div class="empty-state">No transactions are available for this account and period.</div>';
            return;
          }

          statementTable.innerHTML = `
            <table class="transaction-table">
              <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>${filtered
                .map((transaction) => `<tr><td>${transaction.date}</td><td>${transaction.description}</td><td>${transaction.type}</td><td>${transaction.type === "Credit" ? "+" : "-"}${formatCurrency(transaction.amount)}</td><td>${transaction.status}</td></tr>`)
                .join("")}</tbody>
            </table>
          `;
        };

        statementAccount.addEventListener("change", renderStatement);
        statementPeriod.addEventListener("change", renderStatement);
        statementDownload?.addEventListener("click", () => {
          const selectedAccount = accounts.find((account) => account.id === statementAccount.value);
          if (!selectedAccount) return;

          const period = statementPeriod.value;
          const filtered = transactions.filter((transaction) => transaction.accountId === selectedAccount.id && transaction.date.startsWith(period));
          const credits = filtered.filter((item) => item.type === "Credit").reduce((sum, item) => sum + item.amount, 0);
          const debits = filtered.filter((item) => item.type === "Debit").reduce((sum, item) => sum + item.amount, 0);
          const closing = selectedAccount.balance;
          const opening = closing - credits + debits;
          const escapeCSV = (value) => `"${String(value).replaceAll('"', '""')}"`;
          const rows = [
            ["Bank of Kubera", "Account Statement"],
            ["Account", selectedAccount.name],
            ["Account number", selectedAccount.maskedNumber],
            ["Statement period", statementPeriod.selectedOptions[0]?.textContent || period],
            [],
            ["Opening balance (INR)", opening],
            ["Total credits (INR)", credits],
            ["Total debits (INR)", debits],
            ["Closing balance (INR)", closing],
            [],
            ["Date", "Description", "Type", "Amount (INR)", "Status"],
            ...filtered.map((transaction) => [
              transaction.date,
              transaction.description,
              transaction.type,
              transaction.type === "Credit" ? transaction.amount : -transaction.amount,
              transaction.status,
            ]),
          ];
          const csv = `\uFEFF${rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n")}`;
          const filename = `bank-of-kubera-${selectedAccount.type.toLowerCase()}-statement-${period}.csv`;
          const downloadURL = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
          const downloadLink = document.createElement("a");
          downloadLink.href = downloadURL;
          downloadLink.download = filename;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          window.setTimeout(() => URL.revokeObjectURL(downloadURL), 1000);

          if (statementStatus) statementStatus.textContent = `Your statement has been downloaded as ${filename}.`;
        });
        renderStatement();
      } catch (error) {
        statementTable.innerHTML = '<div class="empty-state">Statement data could not be loaded.</div>';
      }
    })();
  }

  const transferForm = document.querySelector("#transfer-form");
  const transferError = document.querySelector("#transfer-error");
  const transferReview = document.querySelector("#transfer-review");
  const transferSuccess = document.querySelector("#transfer-success");
  const transferFromAccount = document.querySelector("#from-account");
  const transferToAccount = document.querySelector("#to-account");
  const transferAmountInput = document.querySelector("#transfer-amount");
  const transferDateInput = document.querySelector("#transfer-date");
  const transferDescriptionInput = document.querySelector("#transfer-description");

  if (transferForm && transferError && transferReview && transferSuccess && transferFromAccount && transferToAccount) {
    const setTransferError = (message) => {
      transferError.textContent = message;
      transferError.classList.add("visible");
      transferReview.classList.add("hidden");
      transferSuccess.classList.remove("visible");
    };

    const loadTransferAccounts = async () => {
      try {
        let accounts;
        try {
          accounts = await loadJSON("../data/demo-accounts.json");
        } catch (error) {
          accounts = fallbackAccounts;
        }
        transferFromAccount.innerHTML = accounts
          .map((account) => `<option value="${account.id}">${account.type} — ${account.maskedNumber}</option>`)
          .join("");
        transferToAccount.innerHTML = accounts
          .map((account) => `<option value="${account.id}">${account.type} — ${account.maskedNumber}</option>`)
          .join("");
      } catch (error) {
        setTransferError("Transfer accounts could not be prepared.");
      }
    };

    loadTransferAccounts();

    transferForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!transferForm.checkValidity()) {
        transferForm.reportValidity();
        setTransferError("Please complete the highlighted transfer fields before reviewing.");
        return;
      }

      const sourceId = transferFromAccount.value;
      const targetId = transferToAccount.value;
      const amount = Number(transferAmountInput.value);
      const date = transferDateInput.value;
      const description = transferDescriptionInput.value.trim();

      if (!sourceId || !targetId || !date || !description) {
        setTransferError("Please complete all required fields before reviewing this transfer.");
        return;
      }

      if (sourceId === targetId) {
        setTransferError("The source and destination accounts must be different.");
        return;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        setTransferError("Please enter a valid transfer amount greater than zero.");
        return;
      }

      try {
        let accounts;
        try {
          accounts = await loadJSON("../data/demo-accounts.json");
        } catch (error) {
          accounts = fallbackAccounts;
        }
        const sourceAccount = accounts.find((account) => account.id === sourceId);
        if (!sourceAccount) {
          setTransferError("Selected source account could not be found.");
          return;
        }

        if (amount > sourceAccount.availableBalance) {
          setTransferError(`Amount exceeds the available balance in ${sourceAccount.type}.`);
          return;
        }

        const targetAccount = accounts.find((account) => account.id === targetId);
        const sourceLabel = sourceAccount.type;
        const targetLabel = targetAccount ? targetAccount.type : "Destination account";

        transferReview.classList.remove("hidden");
        transferReview.innerHTML = `
          <div class="review-stack">
            <p><strong>From:</strong> ${sourceLabel}</p>
            <p><strong>To:</strong> ${targetLabel}</p>
            <p><strong>Amount:</strong> ${formatCurrency(amount)}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Description:</strong> ${description}</p>
          </div>
          <div class="review-actions">
            <button type="button" class="btn btn-ghost" data-action="cancel-transfer">Cancel</button>
            <button type="button" class="btn btn-primary" data-action="confirm-transfer">Confirm</button>
          </div>
        `;
        transferError.classList.remove("visible");

        transferReview.querySelector("[data-action='cancel-transfer']").addEventListener("click", () => {
          transferReview.classList.add("hidden");
          transferSuccess.classList.remove("visible");
        });

        transferReview.querySelector("[data-action='confirm-transfer']").addEventListener("click", () => {
          transferReview.classList.add("hidden");
          const reference = `KUB-${Date.now().toString().slice(-6)}`;
          transferSuccess.innerHTML = `
            <div class="transfer-success-icon" aria-hidden="true">✓</div>
            <div class="transfer-success-copy">
              <p class="eyebrow">Transfer complete</p>
              <h3>${formatCurrency(amount)} sent successfully</h3>
              <p>${sourceLabel} to ${targetLabel} · Ref ${reference}</p>
            </div>
            <button type="button" class="btn btn-secondary transfer-another">Make another transfer</button>
          `;
          transferSuccess.classList.add("visible");
          transferForm.reset();
          transferSuccess.querySelector(".transfer-another").addEventListener("click", () => {
            transferSuccess.classList.remove("visible");
            transferSuccess.innerHTML = "";
            transferDateInput.value = new Date().toISOString().slice(0, 10);
          });
        });
      } catch (error) {
        setTransferError("Unable to complete the transfer review at this time.");
      }
    });
  }

  const billForm = document.querySelector("#bill-form");
  const billError = document.querySelector("#bill-error");
  const billReview = document.querySelector("#bill-review");
  const billSuccess = document.querySelector("#bill-success");
  const billBiller = document.querySelector("#bill-biller");
  const billAmountInput = document.querySelector("#bill-amount");
  const billDateInput = document.querySelector("#bill-date");
  const billCheckoutStatus = document.querySelector("#bill-checkout-status");
  const billSuccessMessage = document.querySelector("#bill-success-message");

  if (billForm && billError && billReview && billSuccess && billBiller && billAmountInput && billDateInput) {
    let billers = [];
    let paymentConfig = { available: false, message: "Razorpay test checkout is not configured." };

    const loadRazorpayCheckout = () => new Promise((resolve, reject) => {
      if (typeof window.Razorpay === "function") {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Razorpay Checkout could not be loaded."));
      document.head.append(script);
    });

    const setBillError = (message) => {
      billError.textContent = message;
      billError.classList.add("visible");
      billReview.classList.add("hidden");
      billSuccess.classList.remove("visible");
    };

    const updateSelectedBiller = () => {
      const biller = billers.find((item) => item.id === billBiller.value);
      billAmountInput.value = biller ? formatCurrency(biller.amount) : "";
      billDateInput.value = biller?.defaultDueDate || "";
    };

    const loadBillData = async () => {
      try {
        const [{ billers: availableBillers }, config] = await Promise.all([
          requestJSON("/api/billers"),
          requestJSON("/api/payments/config"),
        ]);
        billers = availableBillers;
        paymentConfig = config;
        billBiller.replaceChildren();

        if (billers.length === 0) {
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "No bills linked to this profile";
          billBiller.append(option);
          billBiller.disabled = true;
          billCheckoutStatus.textContent = "No billers are linked to this profile yet.";
          return;
        }

        billers.forEach((biller) => {
          const option = document.createElement("option");
          option.value = biller.id;
          option.textContent = `${biller.name} · ${formatCurrency(biller.amount)}`;
          billBiller.append(option);
        });
        updateSelectedBiller();
        billCheckoutStatus.textContent = config.message;
      } catch (error) {
        billBiller.disabled = true;
        billCheckoutStatus.textContent = error.message;
      }
    };

    billBiller.addEventListener("change", updateSelectedBiller);
    loadBillData();

    billForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!billers.length || !billBiller.value) {
        setBillError("No bill is available for payment on this profile.");
        return;
      }

      const selectedBiller = billers.find((biller) => biller.id === billBiller.value);
      if (!selectedBiller) {
        setBillError("The selected bill could not be found.");
        return;
      }

      billReview.innerHTML = `
        <div class="review-stack">
          <p><strong>Biller:</strong> ${selectedBiller.name}</p>
          <p><strong>Category:</strong> ${selectedBiller.category}</p>
          <p><strong>Amount:</strong> ${formatCurrency(selectedBiller.amount)}</p>
          <p><strong>Due date:</strong> ${selectedBiller.defaultDueDate}</p>
          <p><strong>Checkout:</strong> Razorpay test mode</p>
        </div>
        <p class="bill-settlement-warning">This checkout collects a test payment to the merchant. It does not settle the bill with the utility provider.</p>
        <div class="review-actions">
          <button type="button" class="btn btn-ghost" data-action="cancel-bill">Cancel</button>
          <button type="button" class="btn btn-primary" data-action="confirm-bill">Verify card &amp; continue</button>
        </div>
      `;
      billReview.classList.remove("hidden");
      billError.classList.remove("visible");
      billSuccess.classList.remove("visible");

      billReview.querySelector("[data-action='cancel-bill']").addEventListener("click", () => {
        billReview.classList.add("hidden");
      });

      billReview.querySelector("[data-action='confirm-bill']").addEventListener("click", async (confirmEvent) => {
        const confirmButton = confirmEvent.currentTarget;
        if (!paymentConfig.available) {
          setBillError(paymentConfig.message);
          return;
        }
        confirmButton.disabled = true;
        try {
          await loadRazorpayCheckout();
          const { order } = await requestJSON("/api/payments/orders", {
            method: "POST",
            body: JSON.stringify({ billerId: selectedBiller.id }),
          });
          const { user } = await requestJSON("/api/auth/me");
          const checkout = new window.Razorpay({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: "Bank of Kubera Demo",
            description: `Test checkout · ${order.billerName}`,
            order_id: order.id,
            prefill: { name: user.displayName, email: user.email },
            handler: async (result) => {
              try {
                const verification = await requestJSON("/api/payments/verify", {
                  method: "POST",
                  body: JSON.stringify(result),
                });
                if (verification.status === "captured") {
                  billSuccessMessage.textContent = verification.message;
                  billSuccess.classList.add("visible");
                  billReview.classList.add("hidden");
                } else {
                  billCheckoutStatus.textContent = verification.message;
                }
              } catch (error) {
                setBillError(error.message);
              } finally {
                confirmButton.disabled = false;
              }
            },
            modal: { ondismiss: () => { confirmButton.disabled = false; } },
            theme: { color: "#1f5c49" },
          });
          checkout.on("payment.failed", (failure) => {
            confirmButton.disabled = false;
            setBillError(failure.error?.description || "Razorpay did not complete this test payment.");
          });
          checkout.open();
        } catch (error) {
          confirmButton.disabled = false;
          setBillError(error.message);
        }
      });
    });
  }
});
