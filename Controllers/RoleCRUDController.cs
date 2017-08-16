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
    public class RoleCRUDController : Controller
    {
        IVSEC_ROLE_MST _IVSEC_ROLE_MST;
        Dictionary<string, string> GVObjDict;
        public RoleCRUDController()
        {
            _IVSEC_ROLE_MST = new VSEC_ROLE_MST_Repository(new EIA_DEVEntities());
        }

        [ValidateSession]
        // GET: RoleCRUD
        public JsonResult CreateRole(VSEC_ROLE_MST vsec_role_mst)
        {
            try
            {
                string Message = string.Empty;
                bool flag = false;

                try
                {
                    if (vsec_role_mst != null)
                    {
                        string LoginID = string.Empty;
                        GVObjDict = new Dictionary<string, string>();
                        GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                        GVObjDict.TryGetValue("LoginID", out LoginID);

                        vsec_role_mst.CreatedBy = LoginID;
                        _IVSEC_ROLE_MST.CreatRole(vsec_role_mst);

                        Message = "Role Saved Successfully";
                        flag = true;
                    }
                    else
                    {
                        return Json("Failed");
                    }
                }
                catch (Exception e)
                {
                    Message = "Role saved failed! Please try again"; ;
                }

                return new JsonResult { Data = new { Message = Message, Status = flag } };
            }
            catch (Exception e)
            {

                throw;
            }
        }

        [ValidateSession]
        // GET: RoleCRUD
        public JsonResult UpdateRole(VSEC_ROLE_MST vsec_role_mst)
        {
            try
            {
                string Message = string.Empty;
                bool flag = false;

                try
                {
                    if (vsec_role_mst != null)
                    {
                        string LoginID = string.Empty;
                        GVObjDict = new Dictionary<string, string>();
                        GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                        GVObjDict.TryGetValue("LoginID", out LoginID);

                        vsec_role_mst.CreatedBy = LoginID;
                        _IVSEC_ROLE_MST.UpdateRole(vsec_role_mst);

                        Message = "Role Updated Successfully";
                        flag = true;
                    }
                    else
                    {
                        return Json("Failed");
                    }
                }
                catch (Exception e)
                {
                    Message = "Role updation failed! Please try again"; ;
                }

                return new JsonResult { Data = new { Message = Message, Status = flag } };
            }
            catch (Exception e)
            {
                throw;
            }
        }

        [ValidateSession]
        [HttpPost]
        public JsonResult AllocateDeAllocate(string ids, int RoleID, string AllocateDeAllocate)
        {
            try
                {
                    string Message = string.Empty;
                    bool flag = false;

                    try
                    {
                        if (ids != null)
                        {
                            var id = ids.Split(',').Select(x => Int64.Parse(x)).ToArray();

                            string LoginID = string.Empty;
                            GVObjDict = new Dictionary<string, string>();
                            GVObjDict = (Dictionary<string, string>)Session["GMVSession"];
                            GVObjDict.TryGetValue("LoginID", out LoginID);

                            _IVSEC_ROLE_MST.AllocateDeallocateMappedRoles(id, RoleID, LoginID, AllocateDeAllocate);
                            Message = "User" + AllocateDeAllocate + "Successfully";
                            flag = true;
                        }
                        else
                        {
                            return Json("Failed");
                        }
                    }
                    catch (Exception e)
                    {
                        Message = "Allocation/DeAllocation failed! Please try again"; ;
                    }

                    return new JsonResult { Data = new { Message = Message, Status = flag } };
                }
                catch (Exception e)
                {
                    throw;
                }
        }
    }
}