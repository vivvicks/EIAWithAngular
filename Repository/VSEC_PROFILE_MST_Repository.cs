using EIAwithAngular.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace EIAwithAngular.Repository
{
    public class VSEC_PROFILE_MST_Repository : IProfile
    {
        EIA_DEVEntities _db;
        public VSEC_PROFILE_MST_Repository(EIA_DEVEntities objcontext)
        {
            _db = objcontext;
        }

        public IEnumerable<VSEC_PROFILE_MST> LoadProfiles()
        {
            try
            {
                _db.Configuration.ProxyCreationEnabled = false;              

                 var profileList = from profiles in _db.VSEC_PROFILE_MST
                                select profiles;

                return profileList.ToList();
            }
            catch (Exception e)
            {
                throw;
            }
        }


        public IEnumerable<VSEC_PROFILE_MST> SearchRoles(VSEC_PROFILE_MST vsec_profile_mst)
        {
            _db.Configuration.ProxyCreationEnabled = false;


            var q1 = Queryable.Where(_db.VSEC_PROFILE_MST, (p) => p.ProfileName.Contains(vsec_profile_mst.ProfileName));
            var q2 = Queryable.Where(_db.VSEC_PROFILE_MST, (p) => (p.PwdExpDays >= vsec_profile_mst.PwdExpDays && p.PwdExpDays <= vsec_profile_mst.PwdExpDays));
            var q3 = Queryable.Where(_db.VSEC_PROFILE_MST, (p) => (p.PwdGracePeriod >= vsec_profile_mst.PwdGracePeriod && p.PwdGracePeriod <= vsec_profile_mst.PwdGracePeriod));
            var q4 = Queryable.Where(_db.VSEC_PROFILE_MST, (p) => (p.PwdRetryCount >= vsec_profile_mst.PwdRetryCount && p.PwdRetryCount <= vsec_profile_mst.PwdRetryCount));
            var q5 = Queryable.Where(_db.VSEC_PROFILE_MST, (p) => p.NoofSessions > vsec_profile_mst.NoofSessions);

            var ProfileList1 = Queryable.Union(q1, q2);
            var ProfileList2 = Queryable.Union(q3, q4);
            var ProfileList3 = Queryable.Union(ProfileList1, ProfileList2);
            var ProfileList4 = Queryable.Union(ProfileList3, q5);

            var ProfileList = from profiles in ProfileList4
                              select profiles;

            //var ProfileList = _db.VSEC_PROFILE_MST.Where(p => p.ProfileName.Contains(vsec_profile_mst.ProfileName)
            //                                                                   || p.PwdExpDays >= vsec_profile_mst.PwdExpDays
            //                                                                   || p.PwdGracePeriod >= vsec_profile_mst.PwdGracePeriod
            //                                                                   || p.PwdRetryCount >= vsec_profile_mst.PwdRetryCount
            //                                                                   || p.NoofSessions >= vsec_profile_mst.NoofSessions);

            //var ProfileList = from profiles in  _db.VSEC_PROFILE_MST
            //                  where (vsec_profile_mst.ProfileName == null || profiles.ProfileName == vsec_profile_mst.ProfileName)
            //                  && (vsec_profile_mst.PwdExpDays == 0 || profiles.PwdExpDays > vsec_profile_mst.PwdExpDays)

            return ProfileList.ToList();

        }


        public void CreateProfile(VSEC_PROFILE_MST vsec_profile_mst)
        {
            try
            {
                if (vsec_profile_mst != null)
                {
                    VSEC_PROFILE_MST obj = new VSEC_PROFILE_MST
                    {
                        ProfileID = 0,
                        ProfileName = vsec_profile_mst.ProfileName,
                        PwdExpDays = vsec_profile_mst.PwdExpDays,
                        PwdRetryCount = vsec_profile_mst.PwdRetryCount,
                        PwdGracePeriod = vsec_profile_mst.PwdGracePeriod,
                        NoofSessions = vsec_profile_mst.NoofSessions,
                        Status = "A",
                        MC_Status = "A",
                        CreatedBy = vsec_profile_mst.CreatedBy,
                        CreatedOn = DateTime.Now
                    };

                    _db.VSEC_PROFILE_MST.Add(obj);
                    _db.SaveChanges();
                }

            }
            catch (Exception e)
            {
                throw;
            }
        }


        public VSEC_PROFILE_MST GetProfileByID(int ID)
        {
            try
            {
                _db.Configuration.ProxyCreationEnabled = false;

                VSEC_PROFILE_MST vsec_profile_mst = _db.VSEC_PROFILE_MST.Where(r => r.ProfileID == ID).SingleOrDefault();
                return vsec_profile_mst;
            }
            catch (Exception e)
            {
                throw;
            }
        }


        public void UpdateProfile(VSEC_PROFILE_MST vsec_profile_mst)
        {
            try
            {
                if (vsec_profile_mst != null)
                {
                    VSEC_PROFILE_MST obj = new VSEC_PROFILE_MST
                    {
                        ProfileID = vsec_profile_mst.ProfileID,
                        ProfileName = vsec_profile_mst.ProfileName,
                        PwdExpDays = vsec_profile_mst.PwdExpDays,
                        PwdRetryCount = vsec_profile_mst.PwdRetryCount,
                        PwdGracePeriod = vsec_profile_mst.PwdGracePeriod,
                        Status = "A",
                        MC_Status = "A",
                        CreatedBy = vsec_profile_mst.CreatedBy,
                        CreatedOn = DateTime.Now,
                        LastUpDtBy = vsec_profile_mst.CreatedBy,
                        LastUpDtOn = DateTime.Now
                    };

                    _db.VSEC_PROFILE_MST.Attach(obj);
                    _db.Entry(obj).State = EntityState.Modified;
                    _db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                throw;
            }
        }


        public void Remove(int[] ProfileID, string LoginID)
        {
            try
            {
                _db.VSEC_PROFILE_MST
                .Where(x => ProfileID.Contains(x.ProfileID))
                .ToList()
                .ForEach(a =>
                    {
                        a.Status = "D";
                        a.MC_Status = "D";
                        a.LastUpDtBy = LoginID;
                        a.LastUpDtOn = DateTime.Now;
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