
using System.Web.Optimization;

namespace EIAwithAngular.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/RegistrationNgbundle").Include(
                        "~/AngularJS/jquery.js",
                        "~/AngularJS/jquery-ui.js",
                        "~/AngularJS/jquery.common.js",
                        "~/Angularlib/angular.js",
                        "~/Angularlib/angular-animate.js",
                        "~/Angularlib/angular-cookies.js",
                        "~/AngularJS/Module/App.js",
                        "~/AngularJS/AngularController/LoginController.js",
                        "~/AngularJS/OuterModule/igCharLimit.js",
                        "~/AngularJS/OuterModule/md5.js",
                        "~/AngularJS/OuterModule/loading-bar.js",
                        "~/AngularJS/Directive/Angudirective.js",
                        "~/AngularJS/Filters/Filters.js",
                        "~/Scripts/angular-ui-router.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/UserMgmtNgbundle").Include(
                                    "~/AngularJS/jquery.js",
                                    "~/AngularJS/jquery-ui.js",
                                    "~/AngularJS/jquery.common.js",
                                    "~/Angularlib/angular.js",
                                    "~/Angularlib/angular-animate.js",
                                    "~/Angularlib/angular-cookies.js",
                                    "~/Angularlib/angular-route.js",
                                    "~/AngularJS/OuterModule/loading-bar.js",
                                    "~/AngularJS/Module/App.js",
                                    "~/AngularJS/Routing/UserMgmtRoutingModule.js",
                                    "~/AngularJS/AngularController/UserDetailController.js",
                                    "~/AngularJS/OuterModule/igCharLimit.js",
                                    "~/AngularJS/OuterModule/angularPrint.js",
                                    "~/AngularJS/OuterModule/trNgGrid.js",
                                    "~/AngularJS/OuterModule/ui-bootstrap-tpls-2.5.0.js",
                                    "~/AngularJS/Directive/Angudirective.js",
                                    "~/AngularJS/OuterModule/md5.js",
                                    "~/AngularJS/AngularController/RoleDetailController.js",
                                    "~/AngularJS/AngularController/UserRoleMapController.js",
                                    "~/AngularJS/AngularController/profilecontroller.js",
                                    "~/AngularJS/AngularController/MastersController.js",
                                    "~/AngularJS/AngularController/Import.js",
                                    "~/AngularJS/Filters/Filters.js",
                                    "~/Scripts/angular-ui-router.js"
                          ));
           

            bundles.Add(new StyleBundle("~/UserManagement/css").
             Include(
             "~/Content/themes/base/jquery-ui.css",
             "~/bootstrap/css/bootstrap.css",
             "~/Content/Gallery.css",
             "~/Content/angularPrint.css",
             "~/Content/trNgGrid.min.css",
             "~/Content/loading-bar.css",
             "~/Content/loading-bar/structure.css"
             ));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));

        }
    }
}