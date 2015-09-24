# Lamplight Backend API


## User gets braintree client token

##### Description:

    User wants to get the braintree client token in order to complete registration

##### URL:

    POST /api/users/registrations/braintree/token

##### Request params:

    {
      "clientToken": ""
    }

##### Response status:

    200

##### Response params:

    {}

##### Possible Errors:



## Check if an email is unique

##### Description:

    Check if an email is unique

##### URL:

    GET /api/users/registrations/email/unique

##### Request params:

    {
      email: "xxx"
    }

##### Response status:

    200

##### Response params:

    {
      result: true
    }

##### Possible Errors:



## Check if a company name is unique

##### Description:

    Check if a company name is unique

##### URL:

    GET /api/users/registrations/company_name/unique

##### Request params:

    {
      "companyName": "xxx"
    }

##### Response status:

    200

##### Response params:

    {
      result: true
    }

##### Possible Errors:



## User registers a new account

##### Description:

    User wants to register an account

##### URL:

    POST /api/users/registrations

##### Request params:

    {
      "email": "xxx",
      "password": "xxx",
      "companyName": "xxx",
      "title": "mr",
      "givenName": "xxx",
      "familyName": "xxx",
      "jobTitle": "xxx",
      "mobilePhoneNumber": "xxx",
      "officePhoneNumber": "xxx",
      "industryId": "xxx",
      "addressLine1": "xxx",
      "addressLine2": "xxx",
      "addressLine3": "xxx",
      "countryId": "xxx"
      "demo": false,
      "cardHolderName": "xxx",
      "paymentMethodNonce": "xxx",
      "paymentPlanOptionId": "xxx",
      "preferredLocale": "en-US",
      "termsAndConditionsId": "",
      "fairUsePolicyId": "",
    }

##### Response status:

    201

##### Response params:

    {}

##### Possible Errors:



## User confirms the Registration

##### Description:

    User wants to confirm the email in the registration step is valid. After clicking the email confirmation link in email, a webpage will show up which submits the confirmation request

##### URL:

    POST /api/users/confirmations

##### Request params:

    {
      "confirmationToken": "xxx"
    }

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:

    422 - Confirmation Token invalid


## User Login

##### Description:

    User wants to create a login session

##### URL:

    POST /api/users/sessions

##### Request params:

    {
      "email": "xxx",
      "password": "xxx"
    }

##### Response status:

    201

##### Response params:

    {
      session: {
        "authToken": "xxx"
      }
    }

##### Possible Errors:

    422 - Invalid email or password


## User asks for Forgot Password email

##### Description:

    User wants to reset his password. A email with reset password link will be received after submitting forgot password request.

##### URL:

    POST /api/users/forgot_password

##### Request params:

    {
      "email": "xxx"
    }

##### Response status:

    201

##### Response params:

    {}

##### Possible Errors:

    422 - Email does not exist


## User resets his Password

##### Description:

    User wants to set the account password. After clicking the forgot password link in email, a webpage will show up and ask for a new password. The frontend service will submit the reset password token and the new password to backend.

##### URL:

    PUT /api/users/reset_password

##### Request params:

    {
      "resetPasswordToken": "xxx",
      "password": "xxx"
    }

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:

    422 - Reset Password Token invalid


## Invited user sets his password and confirms the account

##### Description:

    After primary user created a new user, the new user will receive an invitation confirmation email. After clicking the link in the email, a webpage will show up and ask for a password for the new user account. The frontend service will submit the invitation token and the new password to backend.

##### URL:

    PUT /api/users/invitation_confirmation

##### Request params:

    {
      "invitationToken": "xxx",
      "password": "xxx"
    }

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:

    422 - Invitation Token invalid


## User Logout

##### Description:

    After logging in, User wants to logout

##### URL:

    DELETE /api/users/sessions

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:


## Get logged in user info

##### Description:

    After logging in, User wants to retrieve his account information

##### URL:

    GET /api/users/me

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "me":{
        "email":"tatonlto@gmail.com",
        "givenName":"Eddie",
        "familyName":"Lau",
        "mobilePhoneNumber":"12345678",
        "officePhoneNumber":"23456789",
        "role": "Primary User",
        "loginCount":2,
        "firstTimeWalkthroughCompleted":false,
        "company":{
          "id":1,
          "name":"42 Labs"
        }
      }
    }


## Update logged in user info

##### Description:

    After logging in, User wants to update his account information

##### URL:

    PUT /api/users/me/info

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      email: "",
      givenName: "",
      familyName: "",
      mobilePhoneNumber: "",
      officePhoneNumber: ""
    }

##### Response status:

    204

##### Response params:

    {}


## Update logged in user password

##### Description:

    After logging in, User wants to change his password

##### URL:

    PUT /api/users/me/password

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      currentPassword: "",
      newPassword: ""
    }

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:

    422 - Incorrect password


## Update logged in user preferred locale

##### Description:

    After logging in, User wants to change his display locale

##### URL:

    PUT /api/users/me/locale

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      preferredLocale: "en-US"
    }

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:



## Delete logged in user account

##### Description:

    After logging in, User wants to delete his account

##### URL:

    DELETE /api/users/me

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    204

##### Response params:

    {}

##### Possible Errors:

    422 - Primary User cannot delete his account


## Get company info of the logged in user

##### Description:

    After logging in, User wants to retrieve his company information

##### URL:

    GET /api/users/company

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "company":{
        "id":1,
        "name":"42 Labs"
      }
    }


## Update company info of the logged in user

##### Description:

    After logging in, User wants to update his company information

##### URL:

    PUT /api/users/company

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      name: "",
      industryId: 1,
      countryId: 1,
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
    }

##### Response status:

    204

##### Response params:

    {
    }


## Change company primary user of the logged in user

##### Description:

    After logging in, User wants to change his company primary user

##### URL:

    PUT /api/users/company/primary_user

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      userId: 1
    }

##### Response status:

    204

##### Response params:

    {
    }


## Get list of Company Users under the company of the logged in user

##### Description:

    After logging in, User wants to retrieve the list of his company users

##### URL:

    GET /api/users/company/users

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "users": [
        "id": 1,
        "email": "xxx",
        "givenName": "",
        "familyName": "",
        "mobilePhoneNumber": "",
        "officePhoneNumber": "",
        "role": "user",
        "is_primary_user": true
      ]
    }


## Get a particular Company User under the company of the logged in user

##### Description:

    After logging in, User wants to retrieve the details of a company user

##### URL:

    GET /api/users/company/users/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      user: {
        "id": 1,
        "email": "xxx",
        "givenName": "",
        "familyName": "",
        "mobilePhoneNumber": "",
        "officePhoneNumber": "",
        "role": "user",
        "is_primary_user": true
      }
    }


## Create a Company User under the company of the logged in user

##### Description:

    After logging in, User wants to create a new user for his company

##### URL:

    POST /api/users/company/users

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "email": "xxx",
      "givenName": "xxx",
      "familyName": "xxx",
      "mobilePhoneNumber": "xxx",
      "officePhoneNumber": "xxx",
      "role": "viewer",
      "is_primary_user": false
    }

##### Response status:

    200

##### Response params:

    {
    }


## Update a Company User

##### Description:

    After logging in, User wants to update another user info

##### URL:

    PUT /api/users/company/users/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "email": "xxx",
      "givenName": "xxx",
      "familyName": "xxx",
      "mobilePhoneNumber": "xxx",
      "officePhoneNumber": "xxx",
      "role": "viewer"
    }

##### Response status:

    204

##### Response params:

    {
    }


## Update a Company User password

##### Description:

    After logging in, User wants to update another user password

##### URL:

    PUT /api/users/company/users/:id/password

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "newPassword": "xxx"
    }

##### Response status:

    204

##### Response params:

    {
    }


## Get list of Searches under the company of the logged in user

##### Description:

    User wants to get all searches

##### URL:

    GET /api/users/searches

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "searches": [
        {
          "id": 1,
          countryIds: [1]
          endDate: null
          industryId: 1
          keywordGroups: [
            {
              language: "en-US",
              containsAll: ["Another"],
              containsAny: [],
              notContainsAll: [],
              notContainsAny: []
            }
          ]
          name: "Another"
          searchPurposeId: 1
          sourceIds: [1, 2]
          startDate: "2015-04-01"
        }
      ]
    }


## Get a particular Search

##### Description:

    User wants to get a particular search

##### URL:

    GET /api/users/searches/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      search: {
        "id": 1,
        countryIds: [1]
        endDate: null
        industryId: 1
        keywordGroups: [
          {
            language: "en-US",
            containsAll: ["Another"],
            containsAny: [],
            notContainsAll: [],
            notContainsAny: []
          }
        ]
        name: "Another"
        searchPurposeId: 1
        sourceIds: [1, 2]
        startDate: "2015-04-01"
      }
    }


## Delete a particular Search

##### Description:

    User wants to delete a particular search

##### URL:

    DELETE /api/users/searches/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    204

##### Response params:

    {
    }


## Create a search under the company of the logged in user

##### Description:

    User wants to create a search for the company

##### URL:

    POST /api/users/searches

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      countryIds: [1]
      endDate: null
      industryId: 1
      keywordGroups: [
        {
          language: "en-US",
          containsAll: ["Another"],
          containsAny: [],
          notContainsAll: [],
          notContainsAny: []
        }
      ]
      name: "Another"
      searchPurposeId: 1
      sourceIds: [1, 2]
      startDate: "2015-04-01"
    }

##### Response status:

    201

##### Response params:

    {}


## Update a search

##### Description:

    User wants to update a search

##### URL:

    PUT /api/users/searches/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      countryIds: [1]
      endDate: null
      industryId: 1
      keywordGroups: [
        {
          language: "en-US",
          containsAll: ["Another"],
          containsAny: [],
          notContainsAll: [],
          notContainsAny: []
        }
      ]
      name: "Another"
      searchPurposeId: 1
      sourceIds: [1, 2]
      startDate: "2015-04-01"
    }

##### Response status:

    204

##### Response params:

    {
    }


## Get list of Search Purposes

##### Description:

    User wants to get all search purposes

##### URL:

    GET /api/users/search_purposes

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "searchPurposes": [
        {
          "id": 1,
          "name": ""
        }
      ]
    }

## Get list of dashboards

##### Description:

    User wants to get the list of dashboards

##### URL:

    GET /api/users/dashboards

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      dashboards: [
        {
          "name": "",
          "searchIds": ["", ""]
        }
      ]
    }

##### Response status:

    200

##### Response params:

    {}


## Get a dashboard

##### Description:

    User wants to get a dashboard

##### URL:

    GET /api/users/dashboards/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "name": "",
      "searchIds": ["", ""],
      "widgetSettings": [
        {

        }
      ]
    }

##### Response status:

    200

##### Response params:

    {}


## Create a dashboard

##### Description:

    User wants to create a dashboard for the company

##### URL:

    POST /api/users/dashboards

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "name": "",
      "templateId": "",
      "searchIds": ["", ""]
    }

##### Response status:

    201

##### Response params:

    {}


## Update a dashboard

##### Description:

    User wants to update a dashboard

##### URL:

    PUT /api/users/dashboards/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "name": "",
      "searchIds": ["", ""]
    }

##### Response status:

    204

##### Response params:

    {}


## Update dashboard widget settings

##### Description:

    User wants to update dashboard widget settings

##### URL:

    PUT /api/users/dashboards/:id/widget_settings

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      widgetSettings: [
        {
          name: "Volume",
          widgetType: "volume",
          chartType: "timeSeries",
          filterType: "search",
          filterOptions: {
            searchIds: []
          },
          cols: 12
        }
      ]
    }

widgetType can be one of the followings:

* volume
* sentiment
* source
* map
* language
* gender
* conversation
* influence

chartType can be one of the followings:

* timeSeries
* doughnut
* vbar
* map
* hbar
* doughnut
* feed

filterType can be one of the followings:

* ""
* search
* language
* source
* location
* sentiment
* gender

filterOptions may contains one of the followings:

* searchIds: ["1", "2"]
* languages: ["en-US", "zh-TW"]
* sourceIds: ["1", "2"]
* countryIds: ["1", "2"]
* sentiments: ["positive", "negative", "neutral"]
* gender: ["male", "female", "unknown"]


##### Response status:

    204

##### Response params:

    {}


## Get data for a widget

##### Description:

    User wants to get data of a widget

##### URL:

    GET /api/users/widget_data

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      widgetType: "volume",
      chartType: "timeSeries",
      filterType: "search",
      filterOptions: {
        searchIds: ["1", "2"]
      }
    }


##### Response status:

    204

##### Response params:

    {}


## Get list of Alert Settings under the company of the logged in user

##### Description:

    User wants to get all alert settings

##### URL:

    GET /api/users/alert_settings

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "alertSettings": [
        {
          "id": 1,
          "key": "",
          "operator": "",
          "value": "",
          "createdAt": "",
        }
      ]
    }


## Get a particular Alert Setting

##### Description:

    User wants to get a particular Alert Setting

##### URL:

    GET /api/users/alert_settings/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      alertSetting: {
        "id": 1,
        "key": "",
        "operator": "",
        "value": "",
        "createdAt": "",
      }
    }


## Create a alert setting under the company of the logged in user

##### Description:

    User wants to create a alert setting for the company

##### URL:

    POST /api/users/alert_settings

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      alertSetting: {
        "key": "",
        "operator": "",
        "value": "",
      }
    }

##### Response status:

    201

##### Response params:

    {
    }


## Update a alert setting

##### Description:

    User wants to update a alert setting

##### URL:

    PUT /api/users/alert_settings/:id

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {
      "key": "",
      "operator": "",
      "value": "",
    }

##### Response status:

    204

##### Response params:

    {
    }


## Get list of alert messages under the company of the logged in user

##### Description:

    User wants to get all alert messages

##### URL:

    GET /api/users/alert_messages

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "alertMessages": [
        {
          "id": 1,
          "message": "xxx",
          "createdAt": "",
          "level": "critical",
          "alertSetting": {
            "id": 1,
            "key": "",
            "operator": "",
            "value": "",
          }
        }
      ]
    }


## Get latest 3 alert messages under the company of the logged in user

##### Description:

    User wants to get latest 3 alert messages

##### URL:

    GET /api/users/alert_messages/latest

##### Request header:

    Authorization: 'Token token="xxx"'

##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "alertMessages": [
        {
          "id": 1,
          "message": "xxx",
          "createdAt": "",
          "level": "critical",
          "alertSetting": {
            "id": 1,
            "key": "",
            "operator": "",
            "value": "",
          }
        }
      ]
    }


## Get list of Countries

##### Description:

    When user registers, user wants to get all countries

##### URL:

    GET /api/users/countries

##### Request header:


##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "countries": [
        {
          "id": 1,
          "name": ""
        }
      ]
    }


## Get list of Industries

##### Description:

    When user registers, user wants to get all industries

##### URL:

    GET /api/users/industries

##### Request header:


##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "industries": [
        {
          "id": 1,
          "name": ""
        }
      ]
    }


## Get list of payment plans

##### Description:

    When user registers, user wants to get all payment plans

##### URL:

    GET /api/users/payment_plans

##### Request header:


##### Request params:

    {}

##### Response status:

    200

##### Response params:

    {
      "paymentPlans": [
        {
          "id": 1,
          "name": "",
          "pricePerMonth": 1,
          "searchesPerMonth": 1,
          "mentionsPerMonth": 1,
          "popular": false
        }
      ]
    }
