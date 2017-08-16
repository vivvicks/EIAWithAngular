using EntityFrameworkExtras.EF6;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace EIAwithAngular.DAL
{
    [StoredProcedure("AddForm1Details")]
    public class AddForm1Details
    {
        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "FlightNumber")]
        public string FlightNumber { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "AirportOfShipment")]
        public string AirportOfShipment { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "IgmNumber")]
        public string IgmNumber { get; set; }

        [StoredProcedureParameter(SqlDbType.Date, ParameterName = "IgmDate")]
        public DateTime IgmDate { get; set; }

        [StoredProcedureParameter(SqlDbType.Int, ParameterName = "TimeOfArrival")]   
        public int TimeOfArrival { get; set; }

        [StoredProcedureParameter(SqlDbType.Date, ParameterName = "DateOfArrival")]
        public DateTime DateOfArrival { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "SupervisorName")]
        public string SupervisorName { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "SecurityOfficer")]
        public string SecurityOfficer { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "AirlineEmpName")]
        public string AirlineEmpName { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "CustomOfficer")]
        public string CustomOfficer { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "DutyOfficer")]
        public string DutyOfficer { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "CourierRepresentative")]
        public string CourierRepresentative { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "UserName")]
        public string UserName { get; set; }

        [StoredProcedureParameter(SqlDbType.BigInt, ParameterName = "Form1Id")]
        public Int64 Form1Id { get; set; }

        [StoredProcedureParameter(SqlDbType.VarChar, ParameterName = "TerminalCode")]
        public string TerminalCode { get; set; }

        [StoredProcedureParameter(SqlDbType.DateTime, ParameterName = "LastUpDtOn")]
        public DateTime LastUpDtOn { get; set; }

        [StoredProcedureParameter(SqlDbType.Udt, ParameterName = "Form1Details")]
        public List<UDTImp_Form1Dtl> Form1Details { get; set; }

        [StoredProcedureParameter(SqlDbType.Int, ParameterName = "ProvosionalIGMNo")]
        public int ProvosionalIGMNo { get; set; }    
    }
}