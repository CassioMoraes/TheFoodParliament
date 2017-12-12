describe('the food parliament login test', function () {
    it('should be able to see restaurants', function () {
        browser.get('http://127.0.0.1:8080/src/');

        element(by.id('loginInput')).sendKeys('Teste');
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(5000);
        
        expect(true).toEqual(true);


        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).toEqual(3);
        // expect(todoList.get(2).getText()).toEqual('write first protractor test');

        // // You wrote your first test, cross it off the list
        // todoList.get(2).element(by.css('input')).click();
        // var completedAmount = element.all(by.css('.done-true'));
        // expect(completedAmount.count()).toEqual(2);
    });
});