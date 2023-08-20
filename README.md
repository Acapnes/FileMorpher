# FileMorpher - LAN Web Portal for Windows File Conversions

Welcome to the FileMorpher project! This initiative was developed during my internship and represents a remarkable journey into creating a versatile Node.js-based Windows service. The heart of the project is the automated conversion of files within a specified folder. This is made possible through a custom Windows service and a user-friendly LAN web portal.

## FileMorpher Overview

FileMorpher introduces a seamless solution for converting files within a designated folder. This is achieved through the orchestration of a Node.js Windows service, which manages the entire conversion process. Meanwhile, an ExpressJS-powered LAN web portal, designed using EJS, offers a user-friendly interface for file selection, configuration, and result retrieval.

### Effortless User Experience

Experience simplified file conversions with FileMorpher in a Windows environment. Access the LAN web portal on the designated port and effortlessly select the files for conversion. Customize the process by configuring output formats, quality settings, and other parameters. Once configured, initiate the conversion with a simple click. The Node.js Windows service takes control, efficiently processing the chosen files. Stay updated on the conversion progress through the web portal. Upon completion, download the converted files directly from the interface. Seamlessly merging automation and user control, FileMorpher provides an efficient solution for file conversions in a Windows environment.

### Enhanced Capabilities with MSSQL

FileMorpher also offers the capability to leverage data from the MSSQL database for enhanced functionality. This integration empowers users to perform operations such as converting files based on data stored in the MSSQL database and manipulating FileStream processes. 

## Key Features and Technologies

- **Windows Service**: Employing Node.js, the project integrates a custom Windows service, driving file conversion and transfer tasks.

- **ExpressJS and EJS**: The ExpressJS framework enables the creation of a LAN web portal for user interaction. EJS enhances the web interface with dynamic content rendering.

- **MSSQL Database**: The application employs MSSQL for data storage and configuration management.

- **Bootstrap Styles**: The LAN web portal boasts an elegant and responsive design, elevated by Bootstrap styles.

- **Big Data Testing and Reporting**: Rigorous big data testing has been conducted, with comprehensive documentation of results and performance benchmarks.

- **Comprehensive Documentation**: An exhaustive user guide and comprehensive software documentation accompany the application, ensuring seamless adoption and future development.

## Logging and Log Management

FileMorpher includes a logging service that diligently records each step of the process. After every operation or automated task, detailed logs are generated and stored in a designated TXT file. This meticulous log tracking ensures transparency in your application's activities and provides a valuable resource for monitoring and analysis.
