// in this file you can append custom step methods to 'I' object
const { I, timeout } = inject()
const { container } = require('codeceptjs');

module.exports = function () {
  return actor({

    /**
    *  Wait and check if this element exist
    * 
    * @param {locator} locator - Set locator from element
    * @param {int} timeoutExpected - optional, in seconds (default in capability)
    * @returns amount of element found
    */
    async isElementVisibleCustom(locator, timeoutExpected) {
      timeoutExpected = timeoutExpected == undefined ? timeout : timeoutExpected
      let numOfElements = 0
      let limit = 0
      if (container.helpers().Appium.config.platform == 'Android') {
        locator = locator.android
      } else {
        locator = locator.ios
      }
      while (numOfElements == 0 && limit < timeoutExpected) {
        I.wait(1)
        console.log('number of trying: ' + limit)
        numOfElements = await I.grabNumberOfVisibleElements(locator);
        limit++
      }
      return numOfElements;
    },

    /**
     * return witch elemente find first
     * 
     * @param {locators} locators Array of locators to try found 
     * @param {int} timeoutExpected - optional, in seconds (default in capability)
     * @returns locator
     */
    async whichElementCustom(arrayLocators, timeoutExpected) {
      timeoutExpected = timeoutExpected == undefined ? timeout : timeoutExpected
      let numOfElements = 0
      let limit = 0
      while (numOfElements == 0 && limit < timeoutExpected) {
        I.wait(1)
        for (let locator of arrayLocators) {
          numOfElements = await I.grabNumberOfVisibleElements(locator)
          if (numOfElements == 1) {
            return locator
          }
        }
        limit++
      }
    },

    /**
    *  SwipUp on screen
    *  
    * @param {locator} elementoProcurado optional
    * @param {locator} elementoRoot optional - default: first element of screen root
    * @param {int} percentFrom optional - default: 20
    * @param {int} percetoTo optional - default: 60
    * @param {int} percetWidthX optional - default: 50
    */
    async swipeUpCustom(elementoProcurado, elementoRoot, percentFrom, percetoTo, percetWidthX) {
      percentFrom = percentFrom == undefined ? 20 : percentFrom
      percetoTo = percetoTo == undefined ? 60 : percetoTo
      await this.swipeDownCustom(elementoProcurado, elementoRoot, percentFrom, percetoTo, percetWidthX)
    },

    /**
    *  SwipDown on screen
    *  
    * @param {locator} elementoProcurado optional
    * @param {locator} elementoRoot optional - default: first element of screen root
    * @param {int} percentFrom optional - default: 60
    * @param {int} percetoTo optional - default: 20
    * @param {int} percetWidthX optional - default: 50
    */
    async swipeDownCustom(elementoProcurado, elementoRoot, percentFrom, percetoTo, percetWidthX) {
      let limit = 0
      let root = ''
      percentFrom = percentFrom == undefined ? 0.6 : (percentFrom / 100)
      percetoTo = percetoTo == undefined ? 0.2 : (percetoTo / 100)
      percetWidthX = percetWidthX == undefined ? 0.5 : (percetWidthX / 100)
      if (container.helpers().Appium.config.platform == 'Android') {
        root = elementoRoot == undefined ? '/hierarchy/android.widget.FrameLayout' : elementoRoot.android
      } else {
        root = elementoRoot == undefined ? '/XCUIElementTypeApplication/XCUIElementTypeWindow' : elementoRoot.ios
      }
      const value = await I.grabElementBoundingRect(root)
      let numOfElements = 0
      while ((numOfElements == 0) && (limit < 15)) {
        I.performSwipe({
          x: (value.x + (value.width * percetWidthX | 0)),
          y: (value.y + (value.height * percentFrom | 0))
        },
          {
            x: (value.x + (value.width * percetWidthX | 0)),
            y: (value.y + (value.height * percetoTo | 0))
          })
        if (elementoProcurado != undefined) {
          numOfElements = await I.grabNumberOfVisibleElements(elementoProcurado)
        } else {
          numOfElements = 1
        }
        limit++
        console.log('Elementos encontrados: ' + numOfElements + ' Tentativas: ' + limit)
      }
      if (elementoProcurado != undefined) {
        I.seeElement(elementoProcurado)
      }
    },


    /**
    *  SwipLeft on screen
    *  
    * @param {locator} elementoProcurado optional
    * @param {locator} elementoRoot optional - default: first element of screen root
    * @param {int} percentFrom optional - default: 20
    * @param {int} percetoTo optional - default: 80
    * @param {int} percetHeightY optional - default: 50
    */
    async swipeLeftCustom(elementoProcurado, elementoRoot, percentFrom, percetoTo, percetWidthX) {
      percentFrom = percentFrom == undefined ? 20 : percentFrom
      percetoTo = percetoTo == undefined ? 80 : percetoTo
      await this.swipeRigtCustom(elementoProcurado, elementoRoot, percentFrom, percetoTo, percetWidthX)
    },

    /**
     *  SwipRight on screen
     *  
     * @param {locator} elementoProcurado optional
     * @param {locator} elementoRoot optional - default: first element of screen root
     * @param {int} percentFrom optional - default: 80
     * @param {int} percetoTo optional - default: 20
     * @param {int} percetHeightY optional - default: 50
     */
    async swipeRightCustom(elementoProcurado, elementoRoot, percentFrom, percetoTo, percetHeightY) {
      let limit = 0
      let root = ''
      percentFrom = percentFrom == undefined ? 0.8 : (percentFrom / 100)
      percetoTo = percetoTo == undefined ? 0.2 : (percetoTo / 100)
      percetHeightY = percetHeightY == undefined ? 0.5 : (percetHeightY / 100)
      if (container.helpers().Appium.config.platform == 'Android') {
        root = elementoRoot == undefined ? '/hierarchy/android.widget.FrameLayout' : elementoRoot.android
      } else {
        root = elementoRoot == undefined ? '/XCUIElementTypeApplication/XCUIElementTypeWindow' : elementoRoot.ios
      }
      const value = await I.grabElementBoundingRect(root)
      let numOfElements = 0
      while ((numOfElements == 0) && (limit < 5)) {
        I.performSwipe({
          x: (value.x + (value.width * percentFrom | 0)),
          y: (value.y + (value.height * percetHeightY | 0))
        },
          {
            x: (value.x + (value.width * percetoTo | 0)),
            y: (value.y + (value.height * percetHeightY | 0))
          })
        if (elementoProcurado != undefined) {
          numOfElements = await I.grabNumberOfVisibleElements(elementoProcurado)
        } else {
          numOfElements = 1
        }
        limit++
        console.log('Elementos encontrados: ' + numOfElements + ' Tentativas: ' + limit)
      }
      if (elementoProcurado != undefined) {
        I.seeElement(elementoProcurado)
      }
    },

    /**
     * wait for element 
     * 
     * @param {locator} - locator 
     * @param {int} - optional, in seconds (default in capability)
     * @returns - undefined or locator visible on the screen
     */
    async waitForElementCustom(locator, timeoutExpected) {
      timeoutExpected = timeoutExpected == undefined ? timeout : timeoutExpected
      let numOfElements = 0
      let limit = 0
      while (numOfElements == 0 && limit < timeoutExpected) {
        numOfElements = await I.grabNumberOfVisibleElements(locator);
        console.log('number of element: ' + numOfElements)
        limit++
        if (numOfElements > 0) {
          return locator
        }
        I.wait(1)
      }
    },

    /**
     * wait for element not visible
     * 
     * @param {locator} locator - locator
     * @param {int} timeoutExpected - optional, in seconds (default in capability)
     */
    async waitForElementNotVisibleCustom(locator, timeoutExpected) {
      timeoutExpected = timeoutExpected == undefined ? timeout : timeoutExpected
      let numOfElements = 1
      let limit = 0
      while (numOfElements > 0 && limit < timeoutExpected) {
        numOfElements = await I.grabNumberOfVisibleElements(locator);
        console.log('number of element: ' + numOfElements)
        I.wait(1)
        limit++
      }
      return numOfElements
    },

    /**
     * Hide keyboard
     */
    hideDeviceKeyboardCustom() {
      if (container.helpers().Appium.config.platform == 'Android') {
        I.hideDeviceKeyboard();
      } else {
        I.tap('//XCUIElementTypeButton[@name="OK"]')
      }
    },
  });
}