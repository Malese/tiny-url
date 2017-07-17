'use strict';

const ESAPI = require('node-esapi');

module.exports.render = (list) => {
  let listTable = list.reverse().map((item, index) => {
    return `
<li class="list-item">
<div class="list-url area-light">
  <a class="list-url__short" id="copytarget${index}" href="${item.short}">${item.short}</a>
  <a class="list-url__long" href="${ESAPI.encoder().encodeForHTML(item.url)}">${ESAPI.encoder().encodeForHTML(item.url)}</a>
</div>
<button class="button button--copy text-hidden clipboard-button" data-clipboard-target="#copytarget${index}" title="copy">
  copy link to clipboard
  <svg class="icon--copy" height="1024" width="896" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 896 1024">
    <path d="M704 896h-640v-576h640v192h64v-320c0-35-29-64-64-64h-192c0-71-57-128-128-128s-128 57-128 128h-192c-35 0-64 29-64 64v704c0 35 29 64 64 64h640c35 0 64-29 64-64v-128h-64v128z m-512-704c29 0 29 0 64 0s64-29 64-64 29-64 64-64 64 29 64 64 32 64 64 64 33 0 64 0 64 29 64 64h-512c0-39 28-64 64-64z m-64 512h128v-64h-128v64z m448-128v-128l-256 192 256 192v-128h320v-128h-320z m-448 256h192v-64h-192v64z m320-448h-320v64h320v-64z m-192 128h-128v64h128v-64z" />
  </svg>
</button>
</li>
`;
  }).join('\n');

  listTable = listTable ? '<ul class="list">' + listTable + '</ul>' : '';

  return listTable;
};
