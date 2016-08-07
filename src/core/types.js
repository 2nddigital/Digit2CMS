module.exports = {
  typeCollection: {
    number: /([0-9]+|[0-9]*\.[0-9]+)/,
    string: /((\"([^\n\r\f\\"]|\\{nl}|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*\")|(\'([^\n\r\f\\']|\\{nl}|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*\'))/,
    uri: /url\(([ \t\r\n\f]*)((\"([^\n\r\f\\"]|\\{nl}|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*\")|(\'([^\n\r\f\\']|\\{nl}|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*\'))([ \t\r\n\f]*)\)|url\(([ \t\r\n\f]*)([!#$%&*-\[\]-~]|([^\0-\237])|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*([ \t\r\n\f]*)\)/,
    dimension: /([0-9]+|[0-9]*\.[0-9]+)([-]?([_a-z]|([^\0-\237])|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))([_a-z0-9-]|([^\0-\237])|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*)/,
    percentage: /([0-9]+|[0-9]*\.[0-9]+)%/,
    hash: /#(([_a-z0-9-]|([^\0-\237])|((\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))+)/,
    module_id: /.*/,
    color: /.*/,
  },
  /**
   * [checkType description]
   * @param  {Object} value value to check
   * @param  {String} typeName name of the type to check
   * @return {Boolean} True if the value is valid for type
   */
  checkType: function(value, typeName){
    if(typeof(this.typeCollection[typeName]) !== 'undefined'){
      var accept = this.typeCollection[typeName].exec(value);
      return (!accept) ? false : true;
    }else{
      return false;
    }
  }
};
