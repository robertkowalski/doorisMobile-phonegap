describe('App functions', function() {

  describe('on success', function() {
    
    beforeEach(function() {
        
      App.init();
    });
    
    it('app dhcp-url should point to bananentage', function() {

      expect(App.dhcpUrl).toEqual('http://bananentage.de/rainerfoobarbatnarfkrams.txt');
      
    });
    
    it('app door-url should point to bananentage', function() {

      expect(App.doorUrl).toEqual('http://dooris.koalo.de/door.txt');
      
    });
    
    it('should process DHCP data to an Array', function() {

      var data = App.processDHCPData("25/Dec/2011:15:20:31\n7\n0\n0\n\n\n");

      expect(data['dateTime']).toEqual(2011 + '-' + '12' + '-' + 25 + ' @ ' + 15 + ':' + 20 + ':' + 31);
      expect(data['countClients']).toEqual('7');
      
    });
    
    it('should process doorstatus data to an Array', function() {
                                     //status   last_updt   last_chg 
      var data = App.processDoorData("unlocked\n1325028651\n1324977736\n1");

      expect(data['doorStatus']).toEqual('unlocked');
      expect(data['date']).toEqual('2011-12-27 @ 22:10');
      
    });
    
    it('should process dateObjects data to a String', function() {
                                     //status   last_updt   last_chg 
      var data = App.processTimestamp('1324977736');

      expect(data).toEqual('2011-12-27 @ 22:10');
      
    });
    
    it('should at a leading 0 to numbers under 10', function() {
        
        expect(App.dateHelper(1)).toEqual('01');
        expect(App.dateHelper(10)).toEqual('10');
        
    });
    
    it('should give back the right month index', function() {
        
      expect(App.createMonthFromString('Feb')).toEqual('02');
      expect(App.createMonthFromString('Dec')).toEqual('12');
      expect(App.createMonthFromString('Oct')).toEqual('10');
      
    });
    
    it('should call the failure callback in case of ajax failure', function() {

      spyOn($, "ajax").andCallFake(function(e) {
        e.error({});
      });

      var updateFailure = jasmine.createSpy();
      var updateSuccess = jasmine.createSpy();
  
      App.update(App.url, updateSuccess, updateFailure);
      
      expect(updateFailure).toHaveBeenCalled();
      expect(updateSuccess).not.toHaveBeenCalled();
      
    });
    
    it('should call the success callback in case of ajax success', function() {

      spyOn($, "ajax").andCallFake(function(e) {
        e.success({});
      });

      var updateFailure = jasmine.createSpy();
      var updateSuccess = jasmine.createSpy();
  
      App.update(App.url, updateSuccess, updateFailure);
      
      expect(updateFailure).not.toHaveBeenCalled();
      expect(updateSuccess).toHaveBeenCalled();
      
    }); 
    
    it('should render the the dhcp-clientcount in the view', function() {
      
      jasmine.getFixtures().fixturesPath = 'www';
      loadFixtures('index.html')
      
      App.updateDHCPSuccess("25/Dec/2011:15:20:31\n7\n0\n0\n\n\n");  
      
      expect($('#clientnumber').text()).toEqual('7');

    });
    
    it('should render the the dhcp-clientcount in the view', function() {
      
      jasmine.getFixtures().fixturesPath = 'www'; 
      loadFixtures('index.html')
      
      App.updateDoorSuccess("unlocked\n1325107066\n1324977736\n1");  
      
      expect($('#doorstatus').find('img').attr('src')).toEqual('images/padlock-open.png');

    });
    
    it('should render the failure message in the view', function() {
      
      jasmine.getFixtures().fixturesPath = 'www';
      loadFixtures('index.html')
      
      App.updateFailure();  
      
      expect($('#msg')).toHaveText('Houston, we had a problem.');

    });
    
  });
 
  describe('App View', function() {
      
    it('should have a msg element', function() {
      
      jasmine.getFixtures().fixturesPath = 'www';
      loadFixtures('index.html')

      expect($('#msg')).toExist();
      
    });

  });
});
