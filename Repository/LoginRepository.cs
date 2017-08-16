using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using EIAwithAngular.Models;
using System.Data.SqlClient;

namespace EIAwithAngular.Repository
{
    public class LoginRepository : ILoginRepository
    {

        EIA_DEVEntities _db;
        public LoginRepository(EIA_DEVEntities objcontext)
        {
            _db = objcontext;
        }

        public string GetPassword(string loginid, string WebSessionId, string IpAddress, string Mode)
        {
            string pwd = _db.Database.SqlQuery<string>("exec proc_VSECGetPasswordByUserName @LoginID, @WebSessionID, @IpAddress, @Mode ",
                                                                      new SqlParameter("@LoginID", loginid),
                                                                      new SqlParameter("@WebSessionID", WebSessionId),
                                                                      new SqlParameter("@IpAddress", IpAddress),
                                                                      new SqlParameter("@Mode", Mode)
                                                           ).FirstOrDefault();

            return pwd;     
        }

        public List<proc_VSECVerifyUser_Result> ValidateUser(string loginid, string password, string WebSessionId, string IpAddress, int Culture)
        {
            List<proc_VSECVerifyUser_Result> Result = _db.Database.SqlQuery<proc_VSECVerifyUser_Result>("exec proc_VSECVerifyUser @LoginID, @password, @IpAddress, @WebSessionID , @CultureID ",
                                                                      new SqlParameter("@LoginID", loginid),
                                                                      new SqlParameter("@password", password),
                                                                      new SqlParameter("@IpAddress", IpAddress),
                                                                      new SqlParameter("@WebSessionID", WebSessionId),
                                                                      new SqlParameter("@CultureID", Culture)
                                                           ).ToList();

            return Result;
        }
    }
}