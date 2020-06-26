/*
1. Set up 3 modules
 a. Model
 b. View
 c. Controller
*/

/************************************************************
 VIEW MODULE
*************************************************************/

const viewController = (() => {
  const dom = {
    screenBottom: '.calc__screen--bottom',
    screenTop: '.calc__screen--top',
    allBtn: '.calc__btn',
  };

  return {
    dom,
    renderInput: (arr) => {
      let formattedArr = arr;

      formattedArr = formattedArr.map((el, ind, arr) => {
        if (el === '*') {
          return (el = 'x');
        } else if (el === '/') {
          return (el = '÷');
        } else if (el === '* -1') {
          el = '';
        }
        return el;
      });

      document.querySelector(dom.screenTop).textContent = formattedArr.join(' ');
    },

    renderTotal: (total) => {
      document.querySelector(dom.screenBottom).textContent = total;
    },

    clearDisplay: () => {
      document.querySelector(dom.screenTop).textContent = '';
      document.querySelector(dom.screenBottom).textContent = '0';
    },
  };
})();

/************************************************************
 MODEL MODULE
*************************************************************/

const modelController = (() => {
  const data = {
    allItems: [],
    total: 0,
  };

  return {
    storeValue: (value) => {
      if (value === '=' || value === 'C') {
        return;
      } else if (value === 'x') {
        data.allItems.push('*');
      } else if (value === '÷') {
        data.allItems.push('/');
      } else if (value === '±') {
        data.allItems.push('* -1');
      } else if (value === '%') {
        data.allItems = [`${data.allItems.join('')} / 100`];
      } else if (value === 'DEL') {
        data.allItems.pop();
        return data.allItems;
      } else {
        data.allItems.push(value);
      }
    },

    returnData: () => {
      return data.allItems;
    },

    execute: () => {
      try {
        let forData = data.allItems.map((c, i, a) => {
          if (c === '*' && a[i + 1] === '*') {
            c = Infinity;
            return c;
          } else if (c === '/' && a[i + 1] === '/') {
            c = Infinity;
            return c;
          } else {
            return c;
          }
        });
        const dataStr = Function(`"use strict"; return ${forData.join('')}`)();
        data.total = dataStr;
      } catch (error) {
        data.total = Infinity;
      }
    },

    returnTotal: () => {
      let total = data.total;

      if (total) {
        if (!Number.isInteger(total) && total !== Infinity) {
          [int, float] = total.toString().split('.');
          float = float.toString().split('');

          let formattedFloat = [];

          if (float.length > 10) {
            for (let i = 0; i < 10; i++) {
              formattedFloat.push(float[i]);
            }

            total = parseFloat(`${int.toString()}.${formattedFloat.join('')}`);
            return total;
          } else {
            return total;
          }
        } else if (total === Infinity) {
          total = 'Err';
          return total;
        }
        return total;
      }
    },

    resetData: () => {
      data.allItems = [];
      return data.allItems;
    },

    retainData: (total) => {
      data.allItems.push(total);
      return data.allItems;
    },

    resetTotal: () => {
      data.total = 0;
      return data.total;
    },
    test: () => data.allItems,
  };
})();

/************************************************************
 CONTROLLER MODULE  
*************************************************************/

const appController = ((viewCtrl, modelCtrl) => {
  const dom = viewCtrl.dom;
  const allBtnArr = Array.from(document.querySelectorAll(dom.allBtn));

  // Calculate Function
  const calculate = (e) => {
    let value, dataArr, total;

    value = e.target.textContent;

    if (e.target.className === 'calc__btn calc__btn--equal') {
      modelCtrl.execute();
      total = modelCtrl.returnTotal();
      modelCtrl.resetData();
      modelCtrl.retainData(total);
      viewCtrl.renderTotal(total);

      //modelCtrl.resetData();
    } else if (e.target.className === 'calc__btn calc__btn--clear') {
      modelCtrl.resetData();
      modelCtrl.resetTotal();
      viewCtrl.clearDisplay();
    } else {
      modelCtrl.storeValue(value);
      dataArr = modelCtrl.returnData();
      viewCtrl.renderInput(dataArr);
      viewCtrl.renderTotal(total);
    }
  };

  const init = () => {
    window.addEventListener('load', () => {
      modelCtrl.resetData();
      viewCtrl.clearDisplay();
    });
  };

  init();

  // Event Listener
  allBtnArr.forEach((arr) => arr.addEventListener('click', calculate));
  window.addEventListener('keypress', (e) => {
    let value, dataArr, total;
    //console.log(e.keyCode);
    e.preventDefault();

    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.which >= 48 && e.which <= 57)) {
      if (e.keyCode === 48 || e.which === 48) {
        value = 0;
      } else if (e.keyCode === 49 || e.which === 49) {
        value = 1;
      } else if (e.keyCode === 50 || e.which === 50) {
        value = 2;
      } else if (e.keyCode === 51 || e.which === 51) {
        value = 3;
      } else if (e.keyCode === 52 || e.which === 52) {
        value = 4;
      } else if (e.keyCode === 53 || e.which === 53) {
        value = 5;
      } else if (e.keyCode === 54 || e.which === 54) {
        value = 6;
      } else if (e.keyCode === 55 || e.which === 55) {
        value = 7;
      } else if (e.keyCode === 56 || e.which === 56) {
        value = 8;
      } else if (e.keyCode === 57 || e.which === 57) {
        value = 9;
      }
    }

    if (e.keyCode === 37 || e.which === 37) {
      value = '%';
    } else if (e.keyCode === 42 || e.keyCode === 120 || e.which === 42 || e.which === 120 || e.keyCode === 88 || e.which === 88) {
      value = 'x';
    } else if (e.keyCode === 43 || e.which === 43) {
      value = '+';
    } else if (e.keyCode === 45 || e.which === 45) {
      value = '-';
    } else if (e.keyCode === 47 || e.keyCode === 47) {
      value = '÷';
    } else if (e.keyCode === 46 || e.keyCode === 46) {
      value = '.';
    }

    if (e.keyCode === 13 || e.keyCode === 61 || e.which === 13 || e.which === 61) {
      modelCtrl.execute();
      total = modelCtrl.returnTotal();
      modelCtrl.resetData();
      modelCtrl.retainData(total);
      viewCtrl.renderTotal(total);
    } else {
      modelCtrl.storeValue(value);
      dataArr = modelCtrl.returnData();
      viewCtrl.renderInput(dataArr);
      viewCtrl.renderTotal(total);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 8) {
      let value, dataArr, total;

      e.preventDefault();

      value = 'DEL';

      modelCtrl.storeValue(value);
      dataArr = modelCtrl.returnData();
      viewCtrl.renderInput(dataArr);
      viewCtrl.renderTotal(total);
    }
  });
})(viewController, modelController);
