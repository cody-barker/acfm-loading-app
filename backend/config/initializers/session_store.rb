Rails.application.config.session_store :cookie_store,
  key: '_acfm_loading_app_session',
  same_site: :lax,
  secure: Rails.env.production?,
  domain: :all,
  expire_after: 24.hours
