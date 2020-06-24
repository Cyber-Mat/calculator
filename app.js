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

      formattedArr = formattedArr.map((el) => {
        if (el === '*') {
          return (el = 'x');
        } else if (el === '/') {
          return (el = '÷');
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
      if (value === '=' || value === 'C' || value === 'DEL') {
        return;
      } else if (value === 'x') {
        data.allItems.push('*');
      } else if (value === '÷') {
        data.allItems.push('/');
      } else {
        data.allItems.push(value);
      }
    },

    returnData: () => {
      return data.allItems;
    },

    execute: (dom) => {
      try {
        const dataStr = Function(`"use strict"; return ${data.allItems.join('')}`)();
        data.total = dataStr;
      } catch (error) {}
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
      //console.log(data.allItems);
      return data.allItems;
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
      modelCtrl.execute(dom);
      total = modelCtrl.returnTotal();
      modelCtrl.resetData();
    } else if (e.target.className === 'calc__btn calc__btn--clear') {
      modelCtrl.resetData();
      viewCtrl.clearDisplay();
    }

    modelCtrl.storeValue(value);
    dataArr = modelCtrl.returnData();
    viewCtrl.renderInput(dataArr);
    viewCtrl.renderTotal(total);
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
  //allBtnArr.forEach((arr) => arr.addEventListener('click', (e) => console.log(e.target.firstElementChild.textContent)));
})(viewController, modelController);
