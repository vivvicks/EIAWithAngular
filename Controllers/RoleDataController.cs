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
    [AntiForgeryValidate]
    public class RoleDataController : ApiController
    {
        IVSEC_ROLE_MST _IVSEC_ROLE_MST;

        public RoleDataController()
        {
            _IVSEC_ROLE_MST = new VSEC_ROLE_MST_Repository(new EIA_DEVEntities());
        }

        // GET api/<controller>
        public IEnumerable<VSEC_ROLE_MST> Get()
        {
            try
            {
                return _IVSEC_ROLE_MST.LoadRoles();
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public IEnumerable<VW_UserDetail> Get(int roleID, string Status, string TerminalCode)
        {
            try
            {
                return _IVSEC_ROLE_MST.searchMappedRoles(roleID, Status, TerminalCode);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public IEnumerable<VSEC_ROLE_MST> Get(string RoleSName, string DisplayName, string Status)
        {
            try
            {
                return _IVSEC_ROLE_MST.SearchRoles(RoleSName,DisplayName,Status);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        // GET api/<controller>/5
        public VSEC_ROLE_MST Get(int id)
        {
            try
            {
                return _IVSEC_ROLE_MST.GetRoleByID(id);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}