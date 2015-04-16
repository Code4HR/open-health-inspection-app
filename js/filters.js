/*
    The frontend for Code for Hampton Roads' Open Health Inspection Data.
    Copyright (C) 2014  Code for Hampton Roads contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

angular.module('openHealthDataAppFilters', [])
  .filter('was', function() {
  	return function(input) {
  		return input ? 'was' : 'wasn\'t';
  	}
  })
  .filter('categoryIcon', function(){
    return function(input) {
      switch (input) {
        case "Education":
          return "fa fa-graduation-cap";
        case "Hospitality":
          return "fa fa-building";
        case "Restaurant":
          return "fa fa-cutlery";
        case "Grocery":
          return "fa fa-shopping-cart";
        case "Government":
          return "fa fa-university";
        case "Medical":
          return "fa fa-plus-square";
        case "Mobile Food":
          return "fa fa-truck";
        case "Other":
          return "fa fa-spoon";
        default:
          return "fa fa-cutlery";
      }
    };
  })
  .filter('scoreColor', function(){
    return function(score) {
      if (score >= 90) {
        //Green
        return "greenText";
      } else if (score >= 80 && score < 90) {
        //Yellow-Green
        return "yellowGreenText";
      } else if (score >= 70 && score < 80) {
        //Yellow
        return "yellowText";
      } else if (score < 70) {
        //Red
        return "redText";
      } else if (score === 'n/a') {
        return "grayText";
      } else {
        return "grayText";
      }
    }
  })
  .filter('scoreBorder', function(){
    return function(score) {
      if (score >= 90) {
        //Green
        return "greenBorder";
      } else if (score >= 80 && score < 90) {
        //Yellow-Green
        return "yellowGreenBorder";
      } else if (score >= 70 && score < 80) {
        //Yellow
        return "yellowBorder";
      } else if (score < 70) {
        //Red
        return "redBorder";
      } else if (score === 'n/a') {
        return "grayBorder";
      } else {
        return "grayBorder";
      }
    }
  })
  .filter('scoreBadge', function(){
    return function(score) {
      if (score >= 90) {
        //Green
        return "greenBadge";
      } else if (score >= 80 && score < 90) {
        //Yellow-Green
        return "yellowGreenBadge";
      } else if (score >= 70 && score < 80) {
        //Yellow
        return "yellowBadge";
      } else if (score < 70) {
        //Red
        return "redBadge";
      } else if (score === 'n/a') {
        return "grayBadge";
      } else {
        return "grayBadge";
      }
    }
  });