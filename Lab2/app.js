const titleBackBtn = document.querySelector('.title__btn-back');
const titleTextElement = document.getElementById('title-text');

const inputCardElements = {
    short: document.getElementById('input-currency-short'),
    name: document.getElementById('input-currency-name'),
    value: document.getElementById('input-currency-value'),
    symbol: document.getElementById('input-currency-symbol'),
    changeCurrencyBtn: document.getElementById('input-currency-btn')
};

const outputCardElements = {
    short: document.getElementById('output-currency-short'),
    name: document.getElementById('output-currency-name'),
    value: document.getElementById('output-currency-value'),
    symbol: document.getElementById('output-currency-symbol'),
    changeCurrencyBtn: document.getElementById('output-currency-btn')
};

const currencyContainerElement = document.getElementById('currency-container');

const numpadElement = document.querySelector('.numpad');
const numpadButtons = numpadElement.querySelectorAll('.numpad__btn');

const searchContainerElement = document.querySelector('.search-container');
const searchInputElement = searchContainerElement.querySelector('.search-input');
const searchWipeBtnElement = searchContainerElement.querySelector('.search-input__wipe');

const currencyList = [];
fetchCurrencyList();

searchInputElement.addEventListener('input', () => {
    renderCurrencyList();
});

searchWipeBtnElement.addEventListener('click', () => {
    searchInputElement.value = '';
        renderCurrencyList();
});

function changeToSecondScreen() {
    titleTextElement.textContent = 'Изменить валюту';
    titleBackBtn.style.display = 'grid';
    changeDisplay('secondScreen');
}

inputCardElements.changeCurrencyBtn.addEventListener('click', () => {
    fetchCurrencyList('inputCard');
    changeToSecondScreen();
});

outputCardElements.changeCurrencyBtn.addEventListener('click', () => {
    fetchCurrencyList('outputCard');
    changeToSecondScreen()
});

titleBackBtn.addEventListener('click', () => {
    titleTextElement.textContent = 'Конвертер валют';
    titleBackBtn.style.display = 'none';
    changeDisplay('firstScreen');
});

function changeDisplay(screen) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(scr => scr.style.display = 'none');
    const screenElement = document.querySelector(`.screen-${screen}`);
    if (screenElement) {
        screenElement.style.display = 'block';
    } else {
        console.error(`Screen ${screen} not found`);
    }
}

changeDisplay('firstScreen');

function fetchCurrencyList(cardName = 'currentCard') {
    currencyList.length = 0;
    currencyList.push({
        code: 'RUB',
        name: 'Российский рубль',
        symbol: 'RUB',
        value: 1
    });

    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(response => response.json())
        .then(data => {
            Object.entries(data.Valute).forEach(([key, value]) => {
                currencyList.push({
                    code: key,
                    name: value.Name,
                    symbol: value.CharCode,
                    value: value.Value
                });
            });
            renderCurrencyList(cardName);
        });
}

function renderCurrencyList(cardName = 'currentCard') {
    currencyContainerElement.innerHTML = '';
    currencyList
        .filter(currency => searchInputElement.value === '' || currency.code.includes(searchInputElement.value.toUpperCase()) || currency.name.includes(searchInputElement.value))
        .sort((a) => (a.code === inputCardElements.short.textContent || a.code === outputCardElements.short.textContent) ? -1 : 0)
        .forEach(currency => {
            let card = document.createElement('div');
            card.classList.add('card__content');
            card.innerHTML = `
            <div class="title-frame">
                <div class="title-frame__text">
                    <h3>${currency.code}</h3>
                    <p>${currency.name}</p>
                </div>
                <div class="title-frame__btn${currency.code === inputCardElements.short.textContent || currency.code === outputCardElements.short.textContent ? '--active' : '--inactive'}">
                    <div class="title-frame__btn__icon">
                        <img src="images/CheckGreen.svg" alt="Select currency">
                    </div>
                </div>
            </div>
        `;
            currencyContainerElement.appendChild(card);
            card.addEventListener('click', () => {
                changeCardCurrency({
                    short: currency.code,
                    name: currency.name,
                    value: currency.value,
                    symbol: currency.symbol
                }, cardName);
            });

        });
}


function changeCardCurrency(newCurrency, cardName = 'currentCard') {
    let targetCardElements = cardName === 'inputCard' ? inputCardElements : outputCardElements;
    targetCardElements.short.textContent = newCurrency.short;
    targetCardElements.name.textContent = newCurrency.name;
    targetCardElements.value.textContent = newCurrency.value;
    targetCardElements.symbol.textContent = newCurrency.symbol;

    inputCardElements.value.textContent = '0';
    outputCardElements.value.textContent = '0';
    fetchCurrencyList()
}

numpadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let value = e.target.textContent;

        if (value === 'AC') {
            inputCardElements.value.textContent = '0';
            return;
        }

        if (value === ',') {
            if (inputCardElements.value.textContent.includes('.')) return;

            inputCardElements.value.textContent += '.';
            return;
        }

        if (e.target.classList.contains('delete-btn')) {
            inputCardElements.value.textContent = inputCardElements.value.textContent.slice(0, -1);

            if (inputCardElements.value.textContent === '') {
                inputCardElements.value.textContent = '0';
            }
            return;
        }

        if (inputCardElements.value.textContent === '0') {
            inputCardElements.value.textContent = '';
        }
        let newValue = parseFloat(inputCardElements.value.textContent + value).toString();
        if (Number.isNaN(newValue)) return;
        inputCardElements.value.textContent = newValue;
    });
});

const observer = new MutationObserver(() => {
    let inputValue = parseFloat(inputCardElements.value.textContent);
    if (isNaN(inputValue)) return;

    let outputValue;
    let inputValueCurrency = currencyList.find(currency => currency.code === inputCardElements.short.textContent);
    let outputValueCurrency = currencyList.find(currency => currency.code === outputCardElements.short.textContent);
    if (!inputValueCurrency || !outputValueCurrency) return;
    outputValue = (inputValue * inputValueCurrency.value / outputValueCurrency.value).toFixed(2);

    let outputSymbol = outputCardElements.symbol.textContent;

    outputCardElements.value.textContent = outputValue;
    outputCardElements.symbol.textContent = outputSymbol;
});

observer.observe(inputCardElements.value, {
    childList: true
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('inputCard', JSON.stringify({
        short: inputCardElements.short.textContent,
        name: inputCardElements.name.textContent,
        value: inputCardElements.value.textContent,
        symbol: inputCardElements.symbol.textContent
    }));
    localStorage.setItem('outputCard', JSON.stringify({
        short: outputCardElements.short.textContent,
        name: outputCardElements.name.textContent,
        value: outputCardElements.value.textContent,
        symbol: outputCardElements.symbol.textContent
    }));
});

window.addEventListener('load', () => {
    if (localStorage.getItem('inputCard')) {
        let data = JSON.parse(localStorage.getItem('inputCard'));
        if (data.short === "" || data.name === "" || data.value === "" || data.symbol === "") {
            localStorage.removeItem('inputCard');
        } else {
            inputCardElements.short.textContent = data.short;
            inputCardElements.name.textContent = data.name;
            inputCardElements.value.textContent = data.value;
            inputCardElements.symbol.textContent = data.symbol;
        }
    }
    if (localStorage.getItem('outputCard')) {
        let data = JSON.parse(localStorage.getItem('outputCard'));
        if (data.short === "" || data.name === "" || data.value === "" || data.symbol === "") {
            localStorage.removeItem('outputCard');
        } else {
            outputCardElements.short.textContent = data.short;
            outputCardElements.name.textContent = data.name;
            outputCardElements.value.textContent = data.value;
            outputCardElements.symbol.textContent = data.symbol;
        }
    }
});