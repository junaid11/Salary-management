Rails.application.config.filter_parameters += [
  :authorization, :passw, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn, :email
]
