  GET|HEAD  / ........................................................................................................
  POST      _ignition/execute-solution . ignition.executeSolution › Spatie\LaravelIgnition › ExecuteSolutionController
  GET|HEAD  _ignition/health-check ............. ignition.healthCheck › Spatie\LaravelIgnition › HealthCheckController
  POST      _ignition/update-config .......... ignition.updateConfig › Spatie\LaravelIgnition › UpdateConfigController
  GET|HEAD  api/cart ............................................................................ CartController@index
  POST      api/cart ............................................................................ CartController@store
  PUT       api/cart/{id} ...................................................................... CartController@update
  DELETE    api/cart/{id} ..................................................................... CartController@destroy
  GET|HEAD  api/categories .................................................................. CategoryController@index
  POST      api/categories .................................................................. CategoryController@store
  GET|HEAD  api/categories/{id} .............................................................. CategoryController@show
  PUT       api/categories/{id} ............................................................ CategoryController@update
  DELETE    api/categories/{id} ........................................................... CategoryController@destroy
  POST      api/login ........................................................................... AuthController@login
  POST      api/logout ......................................................................... AuthController@logout
  GET|HEAD  api/me ................................................................................. AuthController@me
  GET|HEAD  api/my-orders ................................................................... OrderController@myOrders
  GET|HEAD  api/my-payments ............................................................. PaymentController@myPayments
  GET|HEAD  api/order-items ................................................................ OrderItemController@index
  GET|HEAD  api/order-items/{id} ............................................................ OrderItemController@show
  GET|HEAD  api/orders ......................................................................... OrderController@index
  POST      api/orders ......................................................................... OrderController@store
  GET|HEAD  api/payments ..................................................................... PaymentController@index
  POST      api/payments ..................................................................... PaymentController@store
  GET|HEAD  api/products ..................................................................... ProductController@index
  POST      api/products ..................................................................... ProductController@store
  GET|HEAD  api/products/{id} ................................................................. ProductController@show
  PUT       api/products/{id} ............................................................... ProductController@update
  DELETE    api/products/{id} .............................................................. ProductController@destroy
  GET|HEAD  api/products/{id}/reviews ......................................................... ReviewController@index
  POST      api/register ..................................................................... AuthController@register
  POST      api/reviews ....................................................................... ReviewController@store
  DELETE    api/reviews/{id} ................................................................ ReviewController@destroy
  GET|HEAD  sanctum/csrf-cookie .................... sanctum.csrf-cookie › Laravel\Sanctum › CsrfCookieController@show