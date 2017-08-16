using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EIAwithAngular.Repository;
using EIAwithAngular.Models;
using System.Web.Security;
using System.Web.Helpers;
using EIAwithAngular.Filters;
using System.Web.Script.Serialization;

namespace EIAwithAngular.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        ILoginRepository db;
        Random rndno = new Random();
        public LoginController()
        {
            db = new LoginRepository(new EIA_DEVEntities());
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Login()
        {
            if (Session["Culture"] == null)
            {
                Session["Culture"] = "en-US";
            }
            Session["WebSessionId"] = Session.SessionID.ToString() + rndno.Next(990).ToString();
            ViewBag.rndno = rndno.Next(990);
            Session["rndno"] = ViewBag.rndno;

            return View("Login");
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(FormCollection fc)
        {
            if (fc["Username"] != null && fc["password"] != null)
            {
                string output = string.Empty;
                string convertedstr = string.Empty;
                string sUserPassword = string.Empty;

                string password = db.GetPassword(fc["Username"], Convert.ToString(Session["WebSessionId"]), Request.UserHostAddress, "Login");
                if (!string.IsNullOrEmpty(password))
                {
                    convertedstr = password + Convert.ToString(Session["rndno"]);

                    string _NPassword = FormsAuthentication.HashPasswordForStoringInConfigFile(convertedstr, "md5");
                    if (_NPassword.Trim().ToUpper() == fc["password"].Trim().ToUpper())
                    {
                        sUserPassword = password;
                    }
                    else
                    {
                        sUserPassword = fc["password"].Trim();
                    }

                    List<proc_VSECVerifyUser_Result> usersession = db.ValidateUser(fc["Username"], sUserPassword, Convert.ToString(Session["WebSessionId"]), Request.UserHostAddress, 1).ToList();

                    if (usersession.Any(c => c.ValidUser == "Y"))
                    {
                        Session["usersession"] = usersession;

                        Dictionary<string, string> GVObjDict = new Dictionary<string, string>();
                        GVObjDict.Add("PeriodId", "1");
                        GVObjDict.Add("PeroidStatus", "A");
                        GVObjDict.Add("NoofSessions", "4");
                        GVObjDict.Add("LName", "Gup");

                        GVObjDict.Add("LoginID", usersession[0].LoginID);
                        GVObjDict.Add("TerminalCode", Convert.ToString(usersession[0].TerminalCode));
                        GVObjDict.Add("FinancialYear", Convert.ToString(usersession[0].FinancialYear));
                        GVObjDict.Add("UserTypeEICI", Convert.ToString(usersession[0].UserTypeEICI));
                        GVObjDict.Add("AirlineCode", Convert.ToString(usersession[0].AirlineCode));
                        GVObjDict.Add("ServiceTaxPerc", Convert.ToString(usersession[0].ServiceTaxPerc));
                        GVObjDict.Add("PrimaryEduCessPerc", Convert.ToString(usersession[0].PrimaryEduCessPerc));
                        GVObjDict.Add("SecondaryEduCessPerc", Convert.ToString(usersession[0].SecondaryEduCessPerc));
                        GVObjDict.Add("SaleLotAutoMode", Convert.ToString(usersession[0].SaleLotAutoMode));
                        GVObjDict.Add("ReportPreview", Convert.ToString(usersession[0].ReportPreview));
                        GVObjDict.Add("Period", Convert.ToString(usersession[0].Period));

                        remove_Anonymous_Cookies();
                        AddCookie_For_API_Validation(usersession[0].UserMstID);

                        Session["GMVSession"] = GVObjDict;

                        if (usersession.Any(c => c.ValidUser == "Y"))
                        {
                            FormsAuthentication.SetAuthCookie(fc["Username"], false);
                            if (usersession.Any(c => c.LastPasswordChangeDate.ToString().Trim() == ""))
                            {
                                return RedirectToAction("ChangePasswordFirstTime", "ChangePwd");
                            }
                            else if (usersession.Any(c => c.LoginStatus == "0"))
                            {
                                return RedirectToAction("Home", "Home");
                            }
                        }
                    }

                }
            }
            return View();
        }

        public void AddCookie_For_API_Validation(long? ID)
        {
            string cookieToken;
            string formToken;
            AntiForgery.GetTokens(null, out cookieToken, out formToken);
            ViewBag.cookieToken = cookieToken;
            ViewBag.formToken = formToken;
            Random rm = new Random();
            var cookie = new HttpCookie("Token");
            cookie.Value = ID + "*" + cookieToken + "*" + formToken + "*" + DateTime.Now.Date.ToShortDateString() + "*" + DateTime.Now.Date.ToShortTimeString();
            Response.Cookies.Add(cookie);
        }

        [HttpGet]
        public ActionResult Logout()
        {
            if (Request.Cookies["Token"] != null)
            {
                var cookie = new HttpCookie("Token");
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }

            Session.Clear();
            Session.Abandon();
            Session.RemoveAll();
            return RedirectToAction("Login", "Login");

        }

        [NonAction]
        public void remove_Anonymous_Cookies()
        {
            if (Request.Cookies["Token"] != null)
            {
                var cookie = new HttpCookie("Token");
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }
        }

        [AntiForgeryValidate]
        public String GetSession(String Sessionname) 
        {
            string sessionvalue = string.Empty;
            Dictionary<string, string> GVObjDict = new Dictionary<string, string>();
            GVObjDict = (Dictionary<string, string>)Session["GMVSession"];

            if (!(string.IsNullOrEmpty(Sessionname)))
            {
                GVObjDict.TryGetValue(Sessionname, out sessionvalue);
            }
            else 
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                sessionvalue = serializer.Serialize((object)GVObjDict);
            }

            return sessionvalue;
        }
    }
}