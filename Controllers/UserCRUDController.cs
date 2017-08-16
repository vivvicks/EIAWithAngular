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
    public class UserCRUDController : Controller
    {

        IVW_UserDetail _IVW_UserDetail;
        Dictionary<string, string> GVObjDict;
        public UserCRUDController()
        {
            _IVW_UserDetail = new VW_UserDetailRepository(new EIA_DEVEntities());
        }


        [ValidateSession]
        // GET: UserCRUD
        public JsonResult CreateUser(VW_UserDetail vw_userdetail)
        {
            try
            {
                string Message = string.Empty;
                bool flag = false;

                try
                {
                    if (vw_userdetail != null)
                    {
                        string LoginID = string.Empty;
                        GVObjDict = new Dictionary<string, string>();
                        GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                        GVObjDict.TryGetValue("LoginID", out LoginID);

                        vw_userdetail.CreatedBy = LoginID;    
                        _IVW_UserDetail.CreatUser(vw_userdetail);

                        Message = "User Saved Successfully";
                        flag = true;
                    }
                    else
                    {
                        return Json("Failed");
                    }
                }
                catch (Exception)
                {
                    Message = "User Save failed! Please try again";
                }
              return new JsonResult { Data = new { Message = Message, Status = flag } };
            }
            catch (Exception)
            {
                throw;
            }
        }

        [ValidateSession]
        // GET: UserCRUD
        public JsonResult UpdateUser(VW_UserDetail vw_userdetail)
        {
            try
            {
                string Message = string.Empty;
                bool flag = false;
                try
                {
                    if (vw_userdetail != null)
                    {
                        string LoginID = string.Empty;
                        GVObjDict = new Dictionary<string, string>();
                        GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                        GVObjDict.TryGetValue("LoginID", out LoginID);

                        vw_userdetail.CreatedBy = LoginID;

                        _IVW_UserDetail.UpdateUser(vw_userdetail);

                        Message = "User updated Successfully";
                        flag = true;
                    }
                    else
                    {
                        return Json("Failed");
                    }
                }
                catch (Exception)
                {
                    Message = "User update failed! Please try again";
                }
                return new JsonResult { Data = new { Message = Message, Status = flag } };
            }
             catch (Exception)
             {
                 throw;
             }
        }

        [ValidateSession]
        [HttpPost]
        public JsonResult ActivateDeactivate(string ids, string ActivateDeactivate) 
        {
            string Message = string.Empty;
            bool flag = false;
            try
            {
                if (ids != null && ActivateDeactivate != "Unlock")
                {
                    var id = ids.Split(',').Select(x => Int64.Parse(x)).ToArray();

                    string LoginID = string.Empty;
                    GVObjDict = new Dictionary<string, string>();
                    GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                    GVObjDict.TryGetValue("LoginID", out LoginID);

                    _IVW_UserDetail.ActivateDeactivate(id, LoginID, ActivateDeactivate);
                    Message = "User ActivateOrDeactivate Successfully";
                    flag = true;
                }
                else if (ids != null && ActivateDeactivate == "Unlock") 
                {
                    var id = ids.Split(',').Select(x => Int64.Parse(x)).ToArray();

                    string LoginID = string.Empty;
                    GVObjDict = new Dictionary<string, string>();
                    GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                    GVObjDict.TryGetValue("LoginID", out LoginID);

                    _IVW_UserDetail.Unlock(id, LoginID);
                    Message = "User Unlock Successfully";
                    flag = true;
                }
                else
                {
                    return Json("Failed");
                }
            }
            catch (Exception)
            {
                Message = "Activate/Deactivate/Unlock failed! Please try again";
            }
            return new JsonResult { Data = new { Message = Message, Status = flag } };
        }
    }
}