App = {

  dhcpUrl : 'http://bananentage.de/rainerfoobarbatnarfkrams.txt',

  doorUrl: 'http://dooris.koalo.de/door.txt',

  doorTemplate: '',
  dhcpTemplate: '',
  updatingTemplate: '',

  init: function() {
    var self = this,
        dhcpHtml = '<td><img src="images/computer.png" /></td><td class="bottom"><div id="clientnumber" class="font">{{clientCount}}</div></td>',
        doorHtml = '<td><img src="images/{{openLocked}}"/></td><td class="bottom"><div class="font">{{time}}</div></td>',
        updatingHtml = '<td><img src="images/time.png" /></td><td>updating...</td>';

    self.dhcpTemplate = Hogan.compile(dhcpHtml);
    self.doorTemplate = Hogan.compile(doorHtml);
    self.updatingTemplate = Hogan.compile(updatingHtml);

    self.bindToView();
    self.tick();

  },

  update: function(url, callbackSuccess, callbackFailure) {
    var self = this;

    $.ajax({
      url : url,
      success : function(data) {
        callbackSuccess.call(self, data);
      },
      error : callbackFailure
    });

  },

  updateDHCPSuccess: function(data) {
    var self = this,
        openLocked,
        processedData = self.processDHCPData(data),
        output, data;

    output = self.dhcpTemplate.render({
      clientCount: processedData['countClients']
    });

    $('#msg').find('#clientcount').html(output);

  },

  updateDoorSuccess: function(data) {
    var self = this,
        processedData = self.processDoorData(data),
        output;

    if(processedData['doorStatus'] === 'unlocked'){
        openLocked = 'padlock-open.png';
    } else {
        openLocked = 'padlock-closed.png';
    }

    output = self.doorTemplate.render({
      openLocked: openLocked,
      time: processedData['date']
    });

    $('#msg').find('#doorstatus').html(output);

  },

  updateFailure: function() {
    $('#msg').html('<div class="error">Houston, we had a problem.</div>');
  },

  processDHCPData: function(data) {
    var self = this,
        result = [],
        dataArray = data.split(/\n/),

        tempDate = dataArray[0],
        tempDateArray = tempDate.split('/'), //0, 1, 2
        tempTimeArray = tempDate.split(':'), //1, 2, 3

        DD = tempDateArray[0],
        MM = self.createMonthFromString(tempDateArray[1]),
        YYYY = tempDateArray[2].split(':')[0],
        hh = tempTimeArray[1],
        mm = tempTimeArray[2],
        ss = tempTimeArray[3];

    result['dateTime'] = YYYY + '-' + MM + '-' + DD + ' @ ' + hh + ':' + mm + ':' + ss;
    result['countClients'] = dataArray[1];

    return result;
  },

  processDoorData: function(data) {
    var self = this,
        result = [],
        dataArray = data.split(/\n/);

        result['doorStatus'] = dataArray[0];
        result['date'] = self.processTimestamp(dataArray[2]);

    return result;
  },

  processTimestamp: function(timestamp) {
    var self = this,
        dateObj = new Date(Number(timestamp*1000)),

        YYYY = dateObj.getFullYear(),
        MM = self.dateHelper(dateObj.getMonth() + 1),
        DD = self.dateHelper(dateObj.getDate()),
        hh = self.dateHelper(dateObj.getHours()),
        mm = self.dateHelper(dateObj.getMinutes());

    return YYYY + '-' + MM + '-' + DD + ' @ ' + hh + ':' + mm;

  },

  dateHelper: function(date) {
      var result;

      if(date < 10) {
          date = '0'+date;
      }

      return date + ''
  },

  createMonthFromString: function(monthString) {
    var self = this,
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        month = months.indexOf(monthString) + 1;

    month = self.dateHelper(month);

    return month;

  },

  setViewToUpdating: function() {
    var self = this,
        output = self.updatingTemplate.render();

    $('#msg').find('#doorstatus').html(output);
    $('#msg').find('#clientcount').html(output);
    
  },

  tick: function() {
    var self = this;

    self.setViewToUpdating();
    self.update(self.dhcpUrl, self.updateDHCPSuccess, self.updateFailure);
    self.update(self.doorUrl, self.updateDoorSuccess, self.updateFailure);

  },

  bindToView: function() {
    var self = this;

    $('#update').bind('click', function() {
      self.tick();
    });

  }
};


$(document).ready(function() {

  App.init();

});

