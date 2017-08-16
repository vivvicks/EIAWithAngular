using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using EIAwithAngular.Models;
using System.Data.Entity;

namespace EIAwithAngular.Repository
{
    public class VSEC_ROLE_MST_Repository : IVSEC_ROLE_MST
    {
        EIA_DEVEntities _db;
        public VSEC_ROLE_MST_Repository(EIA_DEVEntities objcontext)
        {
            _db = objcontext;
        }

        public void CreatRole(VSEC_ROLE_MST vsec_role_mst)
        {
            try
            {
                if (vsec_role_mst != null)
                {
                    VSEC_ROLE_MST obj = new VSEC_ROLE_MST
                    {
                        RoleId = 0,
                        RoleSName = vsec_role_mst.RoleSName,
                        DisplayName = vsec_role_mst.DisplayName,
                        ActiveFlag = "Y",
                        Status = "A",
                        MC_Status = "A",
                        CreatedBy = vsec_role_mst.CreatedBy,
                        CreatedOn = DateTime.Now
                    };

                    _db.VSEC_ROLE_MST.Add(obj);
                    _db.SaveChanges();
                }

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public VSEC_ROLE_MST GetRoleByID(int ID)
        {
            try
            {
                _db.Configuration.ProxyCreationEnabled = false;

                VSEC_ROLE_MST vsec_role_mst = _db.VSEC_ROLE_MST.Where(r => r.RoleId == ID).SingleOrDefault();
                return vsec_role_mst;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public IEnumerable<VSEC_ROLE_MST> LoadRoles()
        {
            try
            {
                _db.Configuration.ProxyCreationEnabled = false;

                var RolesList = from Roles in _db.VSEC_ROLE_MST
                                select Roles;

                return RolesList.ToList();
            }
            catch (Exception e)
            {
                throw;
            }
            
        }

        public IEnumerable<VSEC_ROLE_MST> SearchRoles(string RoleSName, string DisplayName, string Status)
        {
            try
            {
                _db.Configuration.ProxyCreationEnabled = false;

                var RolesList = from Roles in _db.VSEC_ROLE_MST
                                where Roles.RoleSName.Contains(RoleSName)
                                        || Roles.DisplayName.Contains(DisplayName)
                                            || Roles.Status.Contains(Status)
                                select Roles;

                return RolesList.ToList();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public void UpdateRole(VSEC_ROLE_MST vsec_role_mst)
        {
            try
            {
                if (vsec_role_mst != null)
                {
                    VSEC_ROLE_MST obj = new VSEC_ROLE_MST
                    {
                        RoleId = vsec_role_mst.RoleId,                        
                        RoleSName = vsec_role_mst.RoleSName,
                        DisplayName = vsec_role_mst.DisplayName,
                        ActiveFlag = vsec_role_mst.Status == "A" ? "Y" : "N",
                        Status = vsec_role_mst.Status,
                        MC_Status = vsec_role_mst.Status,
                        CreatedBy = vsec_role_mst.CreatedBy,
                        CreatedOn = DateTime.Now,
                        LastUpDtBy = vsec_role_mst.CreatedBy,
                        LastUpDtOn = DateTime.Now
                    };

                    _db.VSEC_ROLE_MST.Attach(obj);
                    _db.Entry(obj).State = EntityState.Modified;
                    _db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public IEnumerable<VW_UserDetail> searchMappedRoles(int roleID, string Status, string TermincalCode)
        {
            try
            {
                _db.Configuration.ProxyCreationEnabled = false;

                IEnumerable<VW_UserDetail> RolMappedList = Enumerable.Empty<VW_UserDetail>(); ;

                if (Status == "Allocated")
                {
                     RolMappedList =  ( from MapRoles in _db.VSEC_USER_ROLE_MAP
                                        join users in _db.VW_UserDetail on MapRoles.LoginMId equals users.LoginMId 
                                        where MapRoles.RoleId == roleID && users.P1 == TermincalCode
                                        select users
                                        ).ToList();

                     return RolMappedList;
                }
                else if (Status == "Available")
                {
                    RolMappedList = (from users  in _db.VW_UserDetail
                                     join MapRoles in _db.VSEC_USER_ROLE_MAP on users.LoginMId equals MapRoles.LoginMId into joinedusersrole
                                     from joint in joinedusersrole.DefaultIfEmpty()
                                     where users.P1 == TermincalCode && joint.RoleId != roleID
                                     select users
                                     ).Distinct().ToList();

                     return RolMappedList;
                }

                return RolMappedList;
                
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public void AllocateDeallocateMappedRoles(long[] id, int RoleID, string LoginID, string AllocateDeAllocate)
        {
            try
            {
                if (AllocateDeAllocate == "DeAllocate") 
                { 
                    IEnumerable<VSEC_USER_ROLE_MAP> ids = _db.VSEC_USER_ROLE_MAP.Where(x => id.Contains(x.LoginMId)).Where(x => x.RoleId == RoleID).ToList();

                    foreach (VSEC_USER_ROLE_MAP od in ids)
                        _db.VSEC_USER_ROLE_MAP.Remove(od);

                    _db.SaveChanges();
                }
                else if (AllocateDeAllocate == "Allocate")
                {
                    _db.Configuration.AutoDetectChangesEnabled = false;
                    
                    foreach (var item in id)
                    {
                        VSEC_USER_ROLE_MAP obj = new VSEC_USER_ROLE_MAP();

                        obj.LoginMId = item;
                        obj.RoleId = RoleID;
                        obj.Status = "Y";
                        obj.CreatedBy = LoginID;
                        obj.CreatedOn = DateTime.Now;

                        _db.VSEC_USER_ROLE_MAP.Add(obj);
                    }

                    _db.SaveChanges();
                }

            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}