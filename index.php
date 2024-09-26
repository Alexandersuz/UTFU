<?php include 'includes/header.php'; ?>

<div class="container">
    <!-- Кнопки для добавления строки и очистки таблицы -->
    <div class="button-container">
        <button type="button" id="add-row-btn">Добавить строку</button>
        <button type="button" id="clear-btn">Очистить таблицу</button>
    </div>
    
    
    
    <div class="scrollable-container">
        <table id="unit-economy-table">
            <thead>
                <tr>
                    <!-- Заголовки столбцов таблицы -->
                    <th class="column-width-1">#</th>
                    <th class="column-width-2">SKU</th>
                    <th class="column-width-3">ШК</th>
                    <th class="column-width-4">Наименование товара</th>
                    <th class="column-width-5">Закупочная стоимость</th>
                    <th class="column-width-6">Расходы на логистику</th>
                    <th class="column-width-7">Расходы на упаковку</th>
                    <th class="column-width-8">Себестоимость товара</th>
                    <th class="column-width-9">Стоимость к выводу</th>
                    <th class="column-width-10">Чистая прибыль</th>
                    <th class="column-width-11">Наценка в % соотношении</th>
                    <th class="column-width-12">Маржинальность</th>
                    <th class="column-width-13">Цена продажи</th>
                    <th class="column-width-14">Минимальная скидка</th>
                    <th class="column-width-15">Изначальная цена</th>
                    <th class="column-width-16">Скидка</th>
                    <th class="column-width-17">Цена продажи</th>
                    <th class="column-width-18">Скидка для изначальной цены</th>
                    <th class="column-width-19">Категория товара</th>
                    <th class="column-width-20">Комиссия Uzum</th>
                    <th class="column-width-21">Габаритная группа товара</th>
                    <th class="column-width-22">Логистический сбор</th>
                </tr>
            </thead>
            <tbody>
                <!-- Генерация строк таблицы с начальным количеством 10 -->
                <?php for ($i = 1; $i <= 1; $i++): ?>
                <tr>
                    <td><?= $i ?></td> <!-- Номер строки -->
                    <td><input type="text" name="sku[]" class="sku" /></td> <!-- Поле SKU -->
                    <td><input type="text" name="barcode[]" class="barcode" /></td> <!-- Поле ШК -->
                    <td><input type="text" name="productName[]" class="product-name" /></td> <!-- Наименование товара -->
                    <td><input type="text" name="purchaseCost[]" class="purchase-cost" /></td> <!-- Закупочная стоимость -->
                    <td><input type="text" name="logisticsCost[]" class="logistics-cost" /></td> <!-- Расходы на логистику -->
                    <td><input type="text" name="packagingCost[]" class="packaging-cost" /></td> <!-- Расходы на упаковку -->
                    <td><input type="text" name="totalCost[]" class="total-cost" readonly /></td> <!-- Себестоимость товара -->
                    <td><input type="text" name="outputCost[]" class="output-cost" readonly /></td> <!-- Стоимость к выводу -->
                    <td><input type="text" name="netProfit[]" class="net-profit" readonly /></td> <!-- Чистая прибыль -->
                    <td><input type="text" name="markup[]" class="markup" /></td> <!-- Наценка в % -->
                    <td><input type="text" name="margin[]" class="margin" readonly /></td> <!-- Маржинальность -->
                    <td><input type="text" name="sellingPrice[]" class="selling-price" readonly /></td> <!-- Цена продажи -->
                    <td><input type="text" name="minDiscount[]" class="min-discount" /></td> <!-- Минимальная скидка -->
                    <td><input type="text" name="initialCardPrice[]" class="initial-card-price" readonly /></td> <!-- Изначальная цена -->
                    <td><input type="text" name="discount[]" class="discount" /></td> <!-- Скидка -->
                    <td><input type="text" name="salePriceCard[]" class="sale-price-card" readonly /></td> <!-- Цена продажи в карточке -->
                    <td><input type="text" name="discountInitialCardPrice[]" class="discount-initial-card-price" /></td> <!-- Скидка для изначальной цены -->
                    <td>
                        <select name="category[]" class="category">
                            <option value="ProductName1">ProductName1</option>
                            <option value="ProductName2">ProductName2</option>
                            <option value="ProductName3">ProductName3</option>
                        </select> <!-- Категория товара -->
                    </td>
                    <td><input type="text" name="uzumCommission[]" class="uzum-commission" readonly /></td> <!-- Комиссия Uzum -->
                    <td>
                        <select name="logisticsGroup[]" class="logistics-group">
                            <option value="2000">МГТ (до 10 000 сум)</option>
                            <option value="4000">МГТ (от 10 000 до 99 000 сум)</option>
                            <option value="6000">МГТ (от 100 000 сум)</option>
                            <option value="8000">СГТ</option>
                            <option value="20000">КГТ</option>
                        </select> <!-- Габаритная группа товара -->
                    </td>
                    <td><input type="text" name="logisticsFee[]" class="logistics-fee" readonly /></td> <!-- Логистический сбор -->
                </tr>
                <?php endfor; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
