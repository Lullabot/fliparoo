# Fliperoo Read Me File

## Overview
This script is intended to swap out items in a display list with those in a stockpile list. The most obvious use is for a strip of images which swap out from a larger list.

This is meant to be an alternative to a carousel - a little more ambient with less user interaction.

*Created by Jeff Robbins with [Lullabot](http://www.lullabot.com).*

Use examples: 

    $('#mylist').fliperoo();
    $('#mylist').fliperoo({displayCount: 5});
    $('ul.display').fliperoo($('ul.stockpile'));
    $('ul.display').fliperoo($('ul.stockpile'), {
      delay: 1000,
      transTime: 1000, 
      randomize: true
    });  

Requires Rico Sta Cruz' [jQuery Transit plugin](http://ricostacruz.com/jquery.transit/)

## Usage Notes
Fliperoo should be pointed at container elements representing the display and stockpile list. Most web developers will use a `<ul>` or `<ol>` list for this purpose. The children of these elements are used as the list items for display and stockpile. Since it is invalid to add elements between the `<ul>` and `<li>` items, Fliperoo creates a `<div>` element inside of each display `<li>` and effectively moves the content of the `<li>` into the `<div>`. Example:

    <ul>
      <li>one</li>
      <li>two</li>
      <li>three</li>
      <li>four</li>
    </ul>
    
after processing, becomes:

    <ul class="fliperoo-display-list">
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">one</div>
        <div class="fliperoo-display fliperoo-back">five</div>
      </li>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">two</div>
        <div class="fliperoo-display fliperoo-back">six</div>
      </li>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">three</div>
        <div class="fliperoo-display fliperoo-back">seven</div>
      </li>
      <li class="fliperoo-display-container">
        <div class="fliperoo-display fliperoo-front">four</div>
        <div class="fliperoo-display fliperoo-back">eight</div>
      </li>
    </ul>
    
Note the addition of classes and `<div>`s surrounding content.

The `<li>` "container" items are the items which use 3D transforms to flip. The front/back divs flip with their parent. However, note that the `<li>` items should not have a background color on them or they will obscure the child elements when flipped. Instead add styling to the "fliperoo-display" items. Also, `overflow:hidden` on the li items will be problematic. Again, apply it to the nested divs.

### Single vs. Double Lists
Fliperoo works with either two lists or just one. In the case of two lists, one list is the "display" list and the other is the "stockpile". This allows the stockpile list to be hidden with CSS so if Javascript is disabled and Fliperoo doesn't do anything, only a few of the list items will be displayed. It is also possible to use a single list and define the number of items to display using the `displayCount` parameter. Although this is an easier method for most web developers, keep in mind that if Javascript is disabled, all list items will be diplayed. Please allow for this in your CSS styling.