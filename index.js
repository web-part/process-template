const console = require('@webpart/console');
const decode = require('html-entities-decoder');
const cheerio = require('cheerio');


//判断指定的内容是否为完整的页面内容。
function checkFull(content) {
    content = content.toLowerCase(); //统一转小写。

    if (!content.endsWith('</html>')) {
        return false;
    }

    if (!content.includes('<html')) {
        return false;
    }


    if (content.startsWith('<!doctype html>')) {
        return true;
    }

    if (content.startsWith('<html>')) {
        return true;
    }

    if (content.startsWith('<html >')) {
        return true;
    }

    return false;

}



module.exports = {
    /**
    * 对指定的 html 内容中所有首层的 `<template>` 标签进行转换。
    * 即把所有首层的 `<template>` 标签的 innerHTML 
    * 用一对 `<script type="text/template"></script>` 包裹起来。
    * 首层 `<template>` 标签是指它的所有父节点中，不存在 `<template>` 节点。
    * 换言之，如果一个 `<template>` 节点 A 位于另一个 `<template>` 节点 B 中，
    * 则节点 A 不属于首层 `<template>` 标签。
    * 参数：
    *   content: '',    //必选。 要转换的 html 内容。
    *   file: '' || [], //可选。 用于提示的一个或多个文件路径。
    */
    transform(content, file) {
        let $ = cheerio.load(content);
        let tpls = $('template').toArray();

        //没有需要转换的。
        if (!tpls.length) {
            return content;
        }

        let desc = Array.isArray(file) ? '内容合并后的' : '';

        console.log(`转换${desc} <template> 标签`.bgCyan, file);


        tpls.forEach(function (tpl, index) {
            let html = $(tpl).html();
            let holder = `<script type="text/template">${html}</script>`;

            $(tpl).html(holder);
        });

        console.log(`转换了 ${tpls.length} 个 <template> 标签`.cyan);


        let isFullPage = checkFull(content); //判断 content 是否为完整的页面。
        let html = $.html();

        html = decode(html); //把 `&#x` 之类的编码解码回真实的中文。

        //是完整的页面，直接返回。
        if (isFullPage) {
            return html;
        }


        //是 html 片段。
        //因为 $.html() 方法会对 html 片段自动加上 `<html><head></head><body>...</body></html>` 来包裹着，
        //所以需要还原，即解包裹。

        let beginTag = '<html><head></head><body>';
        let endTag = '</body></html>';

        if (html.startsWith(beginTag)) {
            html = html.slice(beginTag.length);
        }

        if (html.endsWith(endTag)) {
            html = html.slice(0, 0 - endTag.length);
        }

        return html;

    },

};