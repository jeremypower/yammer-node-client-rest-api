var YammerGroupsAPI = require("../../lib/groups");
var config = require('../helper/testconfig');
var nock = require('nock');
var groupsClient = new YammerGroupsAPI(config);

var getGroupsResponse = [
    {
        "type": "group",
        "id": 25963441,
        "full_name": "ACME Innovation",
        "name": "ai",
        "description": "A group to talk about topics that relate to innovation. The opening driver is the StartUp Weekend initiative.",
        "privacy": "public",
        "url": "https://www.yammer.com/api/v1/groups/2592363441",
        "web_url": "https://www.yammer.com/acme.com/#/threads/inGroup?type=in_group&feedId=2534963441",
        "mugshot_url": "https://mug0.assets-yammer.com/mugshot/images/48x48/W8ljDXHw8H3bbFNN1b9wsdsdNLKR-dvBxlbB",
        "mugshot_url_template": "https://mug0.assets-yammer.com/mugshot/images/{width}x{height}/W8ljDsdsXHw8H3bbFNN1b9wNLKR-dvBxlbB",
        "mugshot_id": "W8ljDXHw8H3bbFssds9wNLKR-dvBxlbB",
        "office365_url": "https://5cc8aa98dfe94sda.sharepoint.com/sites/532543127",
        "created_at": "2011/11/02 04:44:26 +0000",
        "show_in_directory": "true",
        "creator_type": "user",
        "creator_id": 141714328,
        "state": "active",
        "stats": {
            "members": 208,
            "updates": 353,
            "last_message_id": 37124447450,
            "last_message_at": "2014/02/28 09:13:18 +0000"
        }
    },
    {
        "type": "group",
        "id": 3434963441,
        "full_name": "ACME Management",
        "name": "ai",
        "description": "A group to talk about management stuff",
        "privacy": "public",
        "url": "https://www.yammer.com/api/v1/groups/3434963441",
        "web_url": "https://www.yammer.com/acme.com/#/threads/inGroup?type=in_group&feedId=3434963441",
        "mugshot_url": "https://mug0.assets-yammer.com/mugshot/images/48x48/W8ljDXHw8H3bbFNN1bdsdNLKR-dvBxlbB",
        "mugshot_url_template": "https://mug0.assets-yammer.com/mugshot/images/{width}x{height}/W8ljDHw8H3bbFNN1b9wNLKR-dvBxlbB",
        "mugshot_id": "W8ljDXHw8H3bbFssdR-dvBxlbB",
        "office365_url": "https://5cc8aa98dfe94sda.sharepoint.com/sites/2323234444",
        "created_at": "2012/10/02 04:44:26 +0000",
        "show_in_directory": "true",
        "creator_type": "user",
        "creator_id": 122714328,
        "state": "active",
        "stats": {
            "members": 208,
            "updates": 353,
            "last_message_id": 324447450,
            "last_message_at": "2014/02/28 09:13:18 +0000"
        }
    }
];

var createResponse = { type: 'group',
  id: 4149810,
  full_name: 'Group name',
  name: 'Group name',
  description: 'Goup description',
  privacy: 'public',
  url: 'https://www.yammer.com/api/v1/groups/343343434',
  web_url: 'https://www.yammer.com/acme.com/#/threads/inGroup?type=in_group&feedId=343343434',
  mugshot_url: 'https://mug0.assets-yammer.com/mugshot/images/48x48/group_profile.png',
  mugshot_url_template: 'https://mug0.assets-yammer.com/mugshot/images/{width}x{height}/group_profile.png',
  mugshot_id: null,
  office365_url: null,
  created_at: '2014/03/22 02:54:53 +0000',
  show_in_directory: 'true',
  creator_type: 'user',
  creator_id: 242235555,
  state: 'active',
  stats:
   { members: 1,
     updates: 0,
     last_message_id: null,
     last_message_at: null } };

describe("Test groups API client", function () {
  it("should return groups", function (done) {
    var setupGroupsRequest = nock('https://www.yammer.com')
                .get('/api/v1/groups.json?')
                .reply(200, getGroupsResponse);

    groupsClient.list({}, function(error, data){
      expect(data).not.toBe(null);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].type).toEqual('group');
      done();      
    });
  });

  it("should return a single group", function (done) {
    var groupId = 3434963441;
    var setupGroupsRequest = nock('https://www.yammer.com')
                .get('/api/v1/groups/' + groupId + '.json?')
                .reply(200, getGroupsResponse[1]);
                
    groupsClient.get(groupId, function(error, data){
      expect(data).not.toBe(null);
      expect(data.id).toEqual(groupId);
      done();       
    });
  });

  it("creating a group should return a group", function (done) {
    var name = "Group name";
    var description = "Group description";
    var setupCreateGroups = nock('https://www.yammer.com')
                .post('/api/v1/groups.json?name=' + encodeURIComponent(name) + '&description=' + encodeURIComponent(description))
                .reply(201, createResponse);
                
    groupsClient.create({name:name, description:description}, function(error, data){
      expect(data).not.toBe(null);
      done();      
    });
  });

  it("creating a group with an empty name should fail", function (done) {
    var name = "";
    var setupCreateGroups = nock('https://www.yammer.com')
                .post('/api/v1/groups.json?name=' + encodeURIComponent(name))
                .reply(404, createResponse);
                
    groupsClient.create({name:''}, function(error, data){
      expect(error.statusCode).toBe(404);
      done();      
    });
  });

  it("updating a group should return nothing", function (done) {
    var groupId = 415532232332;
    var name = "Updated name";
    var setupCreateGroups = nock('https://www.yammer.com')
                .put('/api/v1/groups/' + groupId + '.json?name=' + encodeURIComponent(name)) 
                .reply(200);
                
    groupsClient.update(groupId, {name: name}, function(error, data){
      done();      
    });
  });

  it("deleting a group should return a 200", function (done) {
    var groupId = 19343415;
    var setupCreateGroups = nock('https://www.yammer.com')
                .delete('/api/v1/groups/' + groupId +'.json?')
                .reply(200);
                
    groupsClient.delete(groupId, function(error, data){
      expect(error).toBe(null);
      done();
    });
  });

});
