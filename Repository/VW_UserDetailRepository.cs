using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using EIAwithAngular.Models;
using System.Web.Mvc;
using System.Json;
using System.Web.Helpers;
using System.Data.Entity;

namespace EIAwithAngular.Repository
{
    public class VW_UserDetailRepository : IVW_UserDetail
    {
        EIA_DEVEntities _db;
        public VW_UserDetailRepository(EIA_DEVEntities objcontext)
        {
            _db = objcontext;
        }

        public IEnumerable<M_Airline_MST> AirlineList()
        {
            var AirlineList = (from airline in _db.M_Airline_MST
                               select new { airline.AirlineCode, airline.AirlineName }).ToList();

            return AirlineList.AsEnumerable()
                          .Select(o => new M_Airline_MST
                          {
                              AirlineCode = o.AirlineCode,
                              AirlineName = o.AirlineName
                          }).ToList();
        }

        public void CreatUser(VW_UserDetail vw_userdetail)
        {
            try
            { 
                if (vw_userdetail != null)
                {
                    VSEC_USER_MST vsec_user_mst = new VSEC_USER_MST
                    { 
                        UserMstID = _db.VSEC_USER_MST.Max(m => m.UserMstID) + 1,
                        FirstName = vw_userdetail.FirstName,
                        MiddleName = vw_userdetail.MiddleName,
                        LastName = vw_userdetail.LastName,
                        FatherName = vw_userdetail.FatherName,
                        DOB = vw_userdetail.DOB,
                        Gender = vw_userdetail.Gender,
                        Email = vw_userdetail.Email,
                        Address1 = vw_userdetail.Address1,
                        Address2 = vw_userdetail.Address2,
                        Address3 = vw_userdetail.Address3,
                        ContactNo = vw_userdetail.ContactNo,
                        Status = vw_userdetail.Status == "true" ? "A" : "D",
                        MC_Status = vw_userdetail.Status == "true" ? "A" : "D",
                        CreatedBy = vw_userdetail.CreatedBy,
                        CreatedOn = DateTime.Now,
                        P1 = vw_userdetail.P1
                   };

                    VSEC_LOGIN_MST vsec_login_mst = new VSEC_LOGIN_MST
                    {
                        LoginMId = 0,
                        LoginID = vw_userdetail.LoginID,
                        ProfileId = vw_userdetail.ProfileId,
                        ActiveStatus = vw_userdetail.Status == "true" ? "Y" : "N",
                        Password = vw_userdetail.RPassword,
                        CreatedBy = vw_userdetail.CreatedBy,
                        CreatedOn = DateTime.Now
                    };

                    _db.VSEC_USER_MST.Add(vsec_user_mst);

                    using (System.Data.Entity.DbContextTransaction dbTran = _db.Database.BeginTransaction())
                    {
                        try
                        {
                            _db.SaveChanges();

                            vsec_login_mst.UserMstID = _db.VSEC_USER_MST.Max(m => m.UserMstID);
                            _db.VSEC_LOGIN_MST.Add(vsec_login_mst);

                            _db.SaveChanges();

                            dbTran.Commit();
                        }
                        catch (System.Data.Entity.Validation.DbEntityValidationException e)
                        {
                            dbTran.Rollback();
                        }
                    }
                }
           }
            catch(Exception e)
            {
                throw;
            }
        }

        public VW_UserDetail GetUserByID(int ID)
        {
            try
            {
                VW_UserDetail vw_usedetail = _db.VW_UserDetail.Where(r => r.UserMstID == ID).SingleOrDefault();
                return vw_usedetail;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public IEnumerable<VW_UserDetail> LoadUsers(String TermicalCode)
        {
            try
            {
                var UsersList = from Users in _db.VW_UserDetail
                                where Users.P1 == TermicalCode
                                select Users;

                return UsersList.ToList();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public IEnumerable<VW_UserDetail> SearchUsers(string LoginID, string UserName, string[] ActiveStaus, string[] LockStatus)
        {
            try
            {
                var UsersList = from Users in _db.VW_UserDetail
                                where Users.LoginID.Contains(LoginID) 
                                        || Users.Name.Contains(UserName)
                                            || ActiveStaus.Contains(Users.ActiveStatus)
                                              || LockStatus.Contains(Users.LockStatus)
                                select Users;

                return UsersList.ToList();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public void UpdateUser(VW_UserDetail vw_userdetail)
        {
            if (vw_userdetail != null)
            {
                VSEC_USER_MST vsec_user_mst = new VSEC_USER_MST
                {
                    UserMstID = vw_userdetail.UserMstID ,
                    FirstName = vw_userdetail.FirstName,
                    MiddleName = vw_userdetail.MiddleName,
                    LastName = vw_userdetail.LastName,
                    FatherName = vw_userdetail.FatherName,
                    DOB = vw_userdetail.DOB,
                    Gender = vw_userdetail.Gender,
                    Email = vw_userdetail.Email,
                    Address1 = vw_userdetail.Address1,
                    Address2 = vw_userdetail.Address2,
                    Address3 = vw_userdetail.Address3,
                    ContactNo = vw_userdetail.ContactNo,
                    Status = vw_userdetail.Status == "true" ? "A" : "D",
                    MC_Status = vw_userdetail.Status == "true" ? "A" : "D",
                    CreatedBy = vw_userdetail.CreatedBy,
                    CreatedOn = DateTime.Now,
                    UpdatedBy = vw_userdetail.CreatedBy,
                    UpdatedOn = DateTime.Now,
                    P1 = vw_userdetail.P1
                };

                VSEC_LOGIN_MST vsec_login_mst = new VSEC_LOGIN_MST
                {
                    LoginMId = vw_userdetail.LoginMId,
                    LoginID = vw_userdetail.LoginID,
                    ProfileId = vw_userdetail.ProfileId,
                    ActiveStatus = vw_userdetail.Status == "true" ? "Y" : "N",
                    Password = vw_userdetail.RPassword,
                    CreatedBy = vw_userdetail.CreatedBy,
                    CreatedOn = DateTime.Now,
                    UpdatedBy = vw_userdetail.CreatedBy,
                    UpdatedOn = DateTime.Now
                };

                _db.VSEC_USER_MST.Attach(vsec_user_mst);
                _db.Entry(vsec_user_mst).State = EntityState.Modified;

                using (System.Data.Entity.DbContextTransaction dbTran = _db.Database.BeginTransaction())
                {
                    try
                    {
                        _db.SaveChanges();

                        vsec_login_mst.UserMstID = vw_userdetail.UserMstID;
                        _db.VSEC_LOGIN_MST.Attach(vsec_login_mst);
                        _db.Entry(vsec_login_mst).State = EntityState.Modified;

                        _db.SaveChanges();

                        dbTran.Commit();
                    }
                    catch (System.Data.Entity.Validation.DbEntityValidationException e)
                    {
                        dbTran.Rollback();
                    }
                }

            }
        }

        public void ActivateDeactivate(long[] id, string LoginID, string ActivateDeactivate)
        {
            using (System.Data.Entity.DbContextTransaction dbTran = _db.Database.BeginTransaction())
            {
                try
                {
                    _db.VSEC_USER_MST
                    .Where(x => id.Contains(x.UserMstID))
                    .ToList()
                    .ForEach(a =>
                        {
                            a.Status = ActivateDeactivate == "Activate" ? "A" : "D";
                            a.MC_Status = ActivateDeactivate == "Activate" ? "A" : "D";
                            a.LastUpDtBy = LoginID;
                            a.LastUpDtOn = DateTime.Now;
                        });

                    _db.SaveChanges();

                    _db.VSEC_LOGIN_MST
                    .Where(x => id.Contains((long)x.UserMstID))
                    .ToList()
                    .ForEach(a =>
                        {
                            a.ActiveStatus = ActivateDeactivate == "Activate" ? "Y" : "N";
                            a.UpdatedBy = LoginID;
                            a.UpdatedOn = DateTime.Now;
                        });

                    _db.SaveChanges();

                    dbTran.Commit();
                }
                catch (System.Data.Entity.Validation.DbEntityValidationException e)
                {
                    dbTran.Rollback();
                }
            }            
        }


        public void Unlock(long[] id,string LoginID)
        {
            try
            {
                _db.VSEC_LOGIN_MST
                   .Where(x => id.Contains((long)x.UserMstID))
                   .ToList()
                   .ForEach(a =>
                   {
                       a.PasswordRetry = null;
                       a.UpdatedBy = LoginID;
                       a.UpdatedOn = DateTime.Now;
                   });

                _db.SaveChanges();
            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}