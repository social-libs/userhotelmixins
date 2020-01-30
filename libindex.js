function createLib (execlib, dbopsawarehotelmixinlib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry;

  function SocialUserHotelServiceMixin (prophash) {
    this.state.data.listenFor('DBOperations', this.startFollowingUserProfileNotifications.bind(this), true);
  }

  SocialUserHotelServiceMixin.prototype.destroy = function () {
  };

  SocialUserHotelServiceMixin.prototype.startFollowingUserProfileNotifications = function (dbopssink) {
    taskRegistry.run('readState', {
      state: taskRegistry.run('materializeState', {
        sink: dbopssink
      }),
      name: 'lastSocialProfileUpdate',
      //cb: console.log.bind(console, 'SocialUserHotelServiceMixin got lastSocialProfileUpdate')
      cb: this.state.set.bind(this.state, 'lastSocialProfileUpdate')
    });
  };
  /*
  SocialUserHotelServiceMixin.prototype.startFollowingUserProfileNotifications = function () {
    if (!this.destroyed) {
      return;
    }
    var sfupner = this.startFollowingUserProfileNotifications.bind(this),
      d = this.socialDBOpsProfileUpdateDefer;
    this.getUserProfileNotifications().then(
      sfupner,
      sfupner,
      d.notify.bind(d)
    );
    sfupner = null;
    d = null;
  };
  */

  SocialUserHotelServiceMixin.addMethods = function (klass) {
    dbopsawarehotelmixinlib.addMethodReplicator(klass, 'updateUserProfile', 2);
    dbopsawarehotelmixinlib.addMethodReplicator(klass, 'updateUserProfileFromHash', 2);
    dbopsawarehotelmixinlib.addMethodReplicator(klass, 'getUserProfile', 1);
    dbopsawarehotelmixinlib.addMethodReplicator(klass, 'getUserProfileNotifications', 0);
    lib.inheritMethods(klass, SocialUserHotelServiceMixin
      ,'startFollowingUserProfileNotifications'
    );
  };

  return {
    mixins: {
      service: SocialUserHotelServiceMixin
    }
  };
}

module.exports = createLib;
