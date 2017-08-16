using EIAwithAngular.Filters;
using EIAwithAngular.Models;
using EIAwithAngular.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EIAwithAngular.Controllers
{
    public class ProfileController : Controller
    {
        IProfile _IVSEC_PROFILE_MST;
        Dictionary<string, string> GVObjDict;
        public ProfileController()
        {
            _IVSEC_PROFILE_MST = new VSEC_PROFILE_MST_Repository(new EIA_DEVEntities());
        }

        [ValidateSession]
        public JsonResult CreateProfile(VSEC_PROFILE_MST vsec_profile_mst)
        {
            try
            {
                string Message = string.Empty;
                bool flag = false;

                try
                {
                    if (vsec_profile_mst != null)
                    {
                        string LoginID = string.Empty;
                        GVObjDict = new Dictionary<string, string>();
                        GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                        GVObjDict.TryGetValue("LoginID", out LoginID);

                        vsec_profile_mst.CreatedBy = LoginID;
                        _IVSEC_PROFILE_MST.CreateProfile(vsec_profile_mst);

                        Message = "Profile Saved Successfully";
                        flag = true;
                    }
                    else
                    {
                        return Json("Failed");
                    }
                }
                catch (Exception e)
                {
                    Message = "Profile saved failed! Please try again"; ;
                }

                return new JsonResult { Data = new { Message = Message, Status = flag } };
            }
            catch (Exception e)
            {

                throw;
            }
        }

        [ValidateSession]
        public JsonResult UpdateProfile(VSEC_PROFILE_MST vsec_profile_mst)
        {
            try
            {
                string Message = string.Empty;
                bool flag = false;

                try
                {
                    if (vsec_profile_mst != null)
                    {
                        string LoginID = string.Empty;
                        GVObjDict = new Dictionary<string, string>();
                        GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                        GVObjDict.TryGetValue("LoginID", out LoginID);

                        vsec_profile_mst.CreatedBy = LoginID;
                        _IVSEC_PROFILE_MST.UpdateProfile(vsec_profile_mst);

                        Message = "Profile Updated Successfully";
                        flag = true;
                    }
                    else
                    {
                        return Json("Failed");
                    }
                }
                catch (Exception e)
                {
                    Message = "Profile saved failed! Please try again"; ;
                }

                return new JsonResult { Data = new { Message = Message, Status = flag } };
            }
            catch (Exception e)
            {

                throw;
            }
        }

        [ValidateSession]
        public JsonResult Remove(string ids)
        {
            string Message = string.Empty;
            bool flag = false;
            try 
            {
                if (ids != null)
                {
                    var id = ids.Split(',').Select(x => int.Parse(x)).ToArray();

                    string LoginID = string.Empty;
                    GVObjDict = new Dictionary<string, string>();
                    GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                    GVObjDict.TryGetValue("LoginID", out LoginID);

                    _IVSEC_PROFILE_MST.Remove(id, LoginID);
                    Message = "profile remove Successfully";
                    flag = true;
                }
            }
            catch (Exception)
            {
                Message = "profile remove failed! Please try again";
            }
            return new JsonResult { Data = new { Message = Message, Status = flag } };
        }
    }
}