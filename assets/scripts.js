// Задайте актуальную версию проекта
const CURRENT_VERSION = '0.0.5'; 

// Обновление версии на странице после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const versionElement = document.getElementById('version-number'); // Получаем элемент для отображения версии
    if (versionElement) {
        versionElement.textContent = CURRENT_VERSION; // Устанавливаем текст элемента на текущую версию
    } else {
        console.error('Элемент с id "version-number" не найден.'); // Логируем ошибку, если элемент не найден
    }

    const table = document.getElementById('unit-economy-table'); // Получаем элемент таблицы

    // Функция для форматирования чисел
    function formatNumber(value) {
        return value ? parseFloat(value).toLocaleString('ru-RU') : ''; // Форматируем число для отображения
    }

    // Функция для удаления нечисловых символов
    function parseNumber(value) {
        return value.replace(/\s/g, ''); // Удаляем пробелы
    }

    // Функция для округления вверх до ближайшей тысячи
    function roundUpToNearestThousand(value) {
        return Math.ceil(value / 1000) * 1000; // Округляем значение вверх
    }

    // Функция для обновления расчётов в строке
    function updateCalculations(row) {
        const purchaseCost = parseFloat(parseNumber(row.querySelector('.purchase-cost').value)) || 0; // Получаем стоимость закупки
        const logisticsCost = parseFloat(parseNumber(row.querySelector('.logistics-cost').value)) || 0; // Получаем логистические расходы
        const packagingCost = parseFloat(parseNumber(row.querySelector('.packaging-cost').value)) || 0; // Получаем расходы на упаковку
        const totalCost = purchaseCost + logisticsCost + packagingCost; // Общая стоимость

        // Себестоимость товара
        row.querySelector('.total-cost').value = formatNumber(totalCost);

        // Расчет стоимости к выводу
        const markup = parseFloat(row.querySelector('.markup').value) / 100 || 0; // Получаем процент наценки
        const outputCost = totalCost * markup; // Расчет стоимости к выводу
        row.querySelector('.output-cost').value = formatNumber(outputCost);

        // Чистая прибыль
        const netProfit = outputCost - totalCost; // Расчет чистой прибыли
        row.querySelector('.net-profit').value = formatNumber(netProfit);

        // Цена продажи
        const uzumCommission = parseFloat(row.querySelector('.uzum-commission').value) / 100 || 0; // Получаем комиссию
        const logisticsFee = parseFloat(parseNumber(row.querySelector('.logistics-fee').value)) || 0; // Получаем логистический сбор
        const sellingPrice = Math.ceil((outputCost + logisticsFee) / (1 - uzumCommission) / 1000) * 1000; // Расчет цены продажи
        row.querySelector('.selling-price').value = formatNumber(sellingPrice);

        // Цена продажи в карточке (L3/(100%-M3))
        const minDiscount = parseFloat(row.querySelector('.min-discount').value) || 0; // Получаем минимальную скидку
        const sellingPriceCard = roundUpToNearestThousand(sellingPrice / (1 - minDiscount / 100)); // Рассчитываем цену продажи в карточке
        row.querySelector('.sale-price-card').value = formatNumber(sellingPriceCard);

        // Изначальная цена в карточке (P3/(100%-Q3))
        const discountInitialCardPrice = parseFloat(row.querySelector('.discount-initial-card-price').value) || 0; // Получаем начальную цену скидки
        const initialCardPrice = roundUpToNearestThousand(sellingPriceCard / (1 - discountInitialCardPrice / 100)); // Рассчитываем изначальную цену
        row.querySelector('.initial-card-price').value = formatNumber(initialCardPrice);

        // Скидка (N3 - P3)
        const discount = initialCardPrice - sellingPriceCard; // Рассчитываем скидку
        row.querySelector('.discount').value = formatNumber(discount);

        // Расчет маржинальности (I3 / L3)
        const margin = netProfit / sellingPrice || 0; // Рассчитываем маржинальность
        row.querySelector('.margin').value = margin ? Math.floor(margin * 100) + '%' : '';  // Округление вниз и форматирование
    }

    // Функция для обновления процента
    function updatePercentage(input) {
        const value = parseFloat(parseNumber(input.value)) || 0; // Получаем числовое значение
        input.value = value.toFixed(0) + '%'; // Округляем до целого и добавляем '%'
    }

    // Добавление слушателей на изменение данных
    function addRowListeners(row) {
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                // Сохранение значения в Local Storage
                saveData(); // Сохраняем данные после изменения значения

                // Проверяем, является ли поле для процентных значений
                if (input.classList.contains('markup') ||
                    input.classList.contains('min-discount') ||
                    input.classList.contains('discount-initial-card-price') ||
                    input.classList.contains('uzum-commission')) {
                    // Не форматируем значение сразу, а ждем потери фокуса
                    input.addEventListener('blur', function () {
                        updatePercentage(input); // Обновляем процент при потере фокуса
                    });
                } else if (!input.classList.contains('sku') &&
                    !input.classList.contains('barcode') &&
                    !input.classList.contains('product-name')) {
                    // Форматируем только если это не одно из указанных полей
                    input.value = formatNumber(parseNumber(input.value)); // Форматирование числа при вводе
                }
                updateCalculations(row); // Обновляем расчеты в строке
            });
        });

        // Добавляем слушателя на изменение группы логистики
row.querySelector('.logistics-group').addEventListener('change', function () {
    const selectedGroup = parseInt(row.querySelector('.logistics-group').value); // Получаем выбранную группу
    row.querySelector('.logistics-fee').value = formatNumber(selectedGroup); // Устанавливаем значение сбора
    saveData(); // Сохраняем данные после изменения
    updateCalculations(row); // Обновляем расчеты
});

        // Добавляем слушателя на изменение категории
        row.querySelector('.category').addEventListener('change', function () {
            const category = row.querySelector('.category').value; // Получаем выбранную категорию
            let uzumCommission; // Переменная для хранения комиссии

            // Устанавливаем комиссию Uzum в зависимости от категории товара
            switch (category) {
                case 'ProductName1':
                    uzumCommission = 20; // Устанавливаем комиссию 20%
                    break;
                case 'ProductName2':
                    uzumCommission = 15; // Устанавливаем комиссию 15%
                    break;
                case 'ProductName3':
                    uzumCommission = 10; // Устанавливаем комиссию 10%
                    break;
                default:
                    uzumCommission = 0; // По умолчанию 0%
            }

            // Устанавливаем значение комиссии Uzum и обновляем форматирование
            row.querySelector('.uzum-commission').value = uzumCommission; // Устанавливаем значение комиссии
            updatePercentage(row.querySelector('.uzum-commission')); // Форматируем как процент
            saveData(); // Сохраняем данные после изменения
            updateCalculations(row); // Обновляем расчеты
        });
    }

    // Функция для увеличения порядкового номера
    function updateRowNumbering() {
        const rows = table.querySelectorAll('tbody tr'); // Получаем все строки таблицы
        rows.forEach((row, index) => {
            const rowNumberCell = row.querySelector('.row-number'); // Получаем ячейку с номером строки
            if (rowNumberCell) {
                rowNumberCell.textContent = index + 1; // Присваиваем новый номер
            }
        });
    }

    // Функция для сохранения данных в Local Storage
    function saveData() {
        const rowsData = []; // Массив для хранения данных всех строк
        const rows = table.querySelectorAll('tbody tr'); // Получаем все строки таблицы
        rows.forEach(row => {
            const rowData = {}; // Объект для хранения данных одной строки
            row.querySelectorAll('input').forEach(input => {
                rowData[input.className] = input.value; // Сохраняем значения полей
            });
            rowsData.push(rowData); // Добавляем объект с данными в массив
        });
        localStorage.setItem('unitEconomyData', JSON.stringify(rowsData)); // Сохраняем массив строк в Local Storage
    }

    // Функция для загрузки данных из Local Storage
    function loadData() {
        const storedData = localStorage.getItem('unitEconomyData'); // Получаем данные из Local Storage
        if (storedData) {
            const rowsData = JSON.parse(storedData); // Парсим данные из JSON
            const rows = table.querySelectorAll('tbody tr'); // Получаем все строки таблицы
            rowsData.forEach((rowData, index) => {
                if (rows[index]) { // Если строка существует
                    Object.keys(rowData).forEach(key => {
                        const input = rows[index].querySelector(`.${key}`); // Получаем соответствующее поле ввода
                        if (input) {
                            input.value = rowData[key]; // Заполняем значение из Local Storage
                            updateCalculations(rows[index]); // Обновляем расчеты
                        }
                    });
                }
            });
        }
    }

    // Добавление новой строки при нажатии кнопки
    document.getElementById('add-row-btn').addEventListener('click', function () {
        const rowsCount = table.querySelectorAll('tbody tr').length; // Получаем количество строк
        const newRow = table.querySelector('tbody tr:last-child').cloneNode(true); // Клонируем последнюю строку
        newRow.querySelectorAll('input').forEach(input => input.value = ''); // Очищаем значения всех полей в новой строке

        const newRowNumberCell = newRow.querySelector('td:first-child'); // Получаем ячейку для номера новой строки
        if (newRowNumberCell) {
            newRowNumberCell.textContent = rowsCount + 1; // Устанавливаем новый номер
        }

        addRowListeners(newRow); // Добавляем слушатели событий для новой строки
        table.querySelector('tbody').appendChild(newRow); // Добавляем новую строку в таблицу
        saveData(); // Сохраняем данные после добавления новой строки
    });

    // Очистка данных при нажатии кнопки
    document.getElementById('clear-btn').addEventListener('click', function () {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.querySelectorAll('input').forEach(input => input.value = ''); // Очищаем значения всех полей
        });
        updateRowNumbering(); // Обновляем номера строк
        saveData(); // Сохраняем данные после очистки
    });

    // Инициализация при загрузке страницы
    document.querySelectorAll('tbody tr').forEach(row => {
        addRowListeners(row); // Добавляем слушатели событий для каждой строки
    });
    updateRowNumbering(); // Обновляем номера строк
    loadData(); // Загружаем данные из Local Storage
});




















