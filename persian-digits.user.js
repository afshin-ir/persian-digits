// ==UserScript==
// @name         نمایش اعداد به فارسی
// @namespace    https://farabixo.irfarabi.com/
// @version      1.0
// @description  فقط تبدیل ارقام انگلیسی به فارسی
// @match        https://farabixo.irfarabi.com/*
// @match        https://nobitex.ir/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

    function convertDigits(text) {
        return text.replace(/[0-9]/g, digit => persianDigits[digit]);
    }

    function processTextNode(node) {
        if (!node || !node.parentElement) return;

        const tag = node.parentElement.tagName;

        // فقط متن قابل مشاهدهٔ صفحه را تغییر بده
        if (
            tag === 'SCRIPT' ||
            tag === 'STYLE' ||
            tag === 'NOSCRIPT' ||
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT'
        ) {
            return;
        }

        const oldText = node.nodeValue;

        if (/[0-9]/.test(oldText)) {
            node.nodeValue = convertDigits(oldText);
        }
    }

    function processElement(element) {
        if (!element) return;

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );

        const nodes = [];

        let node;
        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        nodes.forEach(processTextNode);
    }

    function start() {
        if (!document.body) return;

        processElement(document.body);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {

                if (mutation.type === 'characterData') {
                    processTextNode(mutation.target);
                }

                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {

                        if (node.nodeType === Node.TEXT_NODE) {
                            processTextNode(node);
                        }

                        else if (node.nodeType === Node.ELEMENT_NODE) {
                            processElement(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.body) {
        start();
    } else {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                start();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

})();
