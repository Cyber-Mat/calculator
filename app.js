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
  return {
    dom: {
      screenBottom: '.calc__screen--bottom',
      screenTop: '.calc__screen--top',
      allBtn: '.calc__btn',
      clearBtn: '.btn__clear',
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

  const getBeforeOp = () => {
    let beforeOp = [];

    for (let i = 0; i < data.allItems.length; i++) {
      let item = data.allItems[i];
      if (parseInt(item) || parseInt(item) === 0) {
        beforeOp.push(item);
        data.allItems.splice(i, 1, '');
      } else if (!parseInt(item)) {
        break;
      }
    }

    return parseInt(beforeOp.join(''));
  };

  const getOperator = () => {
    let operator = [];
    console.log(data.allItems);

    for (let i = 0; i < data.allItems.length; i++) {
      let item = data.allItems[i];
      if (parseInt(item) || parseInt(item) === 0) {
        break;
      } else if (!parseInt(item)) {
        operator.push(item);
      }
    }
    return operator;
  };

  const getAfterOp = () => {
    let afterOp = [];

    for (let i = 0; i < data.allItems.length; i++) {
      let item = data.allItems[i];
      if (parseInt(item) || parseInt(item) === 0) {
        afterOp.push(item);
      } else if (!parseInt(item)) {
        continue;
      }
    }
    return parseInt(afterOp.join(''));
  };

  const getCalc = (operator, numArr) => {
    let total = 0;

    operator.forEach((op) => {
      if (op === '+') {
        total = numArr.reduce((x, y) => x + y, 0);
        return total;
      } else if (op === '-') {
        total = numArr.reduce((x, y) => x - y);
        return total;
      } else if (op === 'x') {
        total = numArr.reduce((x, y) => x * y, 1);
        return total;
      } else if (op === '/') {
        total = numArr.reduce((x, y) => x / y);
        return total;
      } else if (op === '=') {
        return total;
      }
    });
    return total;
  };

  return {
    storeValue: (value) => {
      if (value === '=') {
        return;
      } else {
        data.allItems.push(value);
      }
    },

    execute: () => {
      const beforeOp = getBeforeOp();
      const operator = getOperator();
      const afterOp = getAfterOp();
      const numArr = [beforeOp, afterOp];
      const total = getCalc(operator, numArr);

      console.log(numArr);
      console.log(operator);
      console.log(total);
    },
    resetData: () => {
      data.allItems = [];
      console.log(data.allItems);
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
    let value;
    if (e.target.firstElementChild) {
      value = e.target.firstElementChild.textContent;

      if (e.target.firstElementChild.className === 'btn__equal') {
        modelCtrl.execute();
        modelCtrl.resetData();
      }
    } else {
      value = e.target.textContent;
      if (e.target.className === 'btn__equal') {
        modelCtrl.execute();
        modelCtrl.resetData();
      }
    }
    modelCtrl.storeValue(value);
  };

  // Event Listener
  allBtnArr.forEach((arr) => arr.addEventListener('click', calculate));
  //allBtnArr.forEach((arr) => arr.addEventListener('click', (e) => console.log(e.target.firstElementChild.textContent)));
})(viewController, modelController);
