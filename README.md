# @webpart/process-template

对指定的 html 内容中所有首层的 `<template>` 标签进行转换。  

即把所有首层的 `<template>` 标签的 innerHTML 用一对 `<script type="text/template"></script>` 包裹起来。  
首层 `<template>` 标签是指它的所有父节点中，不存在 `<template>` 节点。  
换言之，如果一个 `<template>` 节点 A 位于另一个 `<template>` 节点 B 中，则节点 A 不属于首层 `<template>` 标签。  
