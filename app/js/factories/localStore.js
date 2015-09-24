'use strict';

/**
 * @ngInject
 */
function LocalStore($cookieStore, APP_CONFIG) {
  var self = this;

  var KEY_AUTH_TOKEN = "authToken";
  var KEY_PREFERRED_LOCALE = "preferredLocale";

  function cc(key) {
    return "LamplightUsers." + key;
  }

  return {
    save: function (key, value) {
      if (value) {
        $cookieStore.put(cc(key), value, {
          domain: APP_CONFIG.cookies.domain, secure: APP_CONFIG.cookies.secure
        });
      } else {
        this.remove(key);
      }
    },

    load: function (key) {
      return $cookieStore.get(cc(key));
    },

    remove: function (key) {
      $cookieStore.remove(cc(key));
    },

    saveAuthToken: function(authToken) {
      this.save(KEY_AUTH_TOKEN, authToken);
    },

    loadAuthToken: function() {
      return this.load(KEY_AUTH_TOKEN);
    },

    removeAuthToken: function() {
      this.remove(KEY_AUTH_TOKEN);
    },

    savePreferredLocale: function(locale) {
      this.save(KEY_PREFERRED_LOCALE, locale);
    },

    loadPreferredLocale: function() {
      return this.load(KEY_PREFERRED_LOCALE);
    }
  };
}

module.exports = LocalStore;
