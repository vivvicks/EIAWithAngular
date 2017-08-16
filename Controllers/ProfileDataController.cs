using EIAwithAngular.Filters;
using EIAwithAngular.Models;
using EIAwithAngular.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace EIAwithAngular.Controllers
{
    //[AntiForgeryValidate]
    public class ProfileDataController : ApiController
    {
         IProfile _IVSEC_PROFILE_MST;
         public ProfileDataController()
        {
            _IVSEC_PROFILE_MST = new VSEC_PROFILE_MST_Repository(new EIA_DEVEntities());
        }

         public IEnumerable<VSEC_PROFILE_MST> Get()
         {
             try
             {
                 return _IVSEC_PROFILE_MST.LoadProfiles();
             }
             catch (Exception e)
             {
                 throw;
             }
         }

         public VSEC_PROFILE_MST Get(int id)
         {
             try
             {
                 return _IVSEC_PROFILE_MST.GetProfileByID(id);
             }
             catch (Exception e)
             {
                 throw;
             }
         }

        [HttpPost]
         public IEnumerable<VSEC_PROFILE_MST> Get(VSEC_PROFILE_MST vsec_profile_mst)
         {
             try
             {
                 return _IVSEC_PROFILE_MST.SearchRoles(vsec_profile_mst);
             }
             catch (Exception e)
             {

                 throw;
             }
         }
    }
}
