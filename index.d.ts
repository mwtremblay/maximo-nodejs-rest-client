// Type definitions for ibm-maximo-api 1.0
// Project: https://github.com/sachbalag/ibm-maximo-api
// Definitions by: Claude Code

declare module 'ibm-maximo-api' {
  /**
   * Configuration options for Maximo connection
   */
  export interface MaximoOptions {
    /** Protocol: 'http' or 'https' */
    protocol: string;
    /** Maximo server hostname */
    hostname: string;
    /** Maximo server port */
    port: string | number;
    /** Maximo username */
    user: string;
    /** Maximo password */
    password: string;
    /** Authentication scheme path (e.g., '/maximo') */
    auth_scheme: string;
    /** Authentication type: 'maxauth' or 'form' */
    authtype?: string;
    /** Use lean mode (0 or 1) */
    islean?: number;
    /** Tenant code for multi-tenant environments */
    tenantcode?: string;
  }

  /**
   * Authentication cookie object
   */
  export interface AuthCookie {
    'set-cookie': string[];
    [key: string]: any;
  }

  /**
   * Metadata for file attachments
   */
  export interface AttachmentMeta {
    /** Attachment filename */
    name: string;
    /** Attachment description */
    description: string;
    /** Type: typically 'FILE' */
    type: string;
    /** Storage type: 'Attachment' or other */
    storeas: string;
    /** Content type (MIME type) */
    contentype: string;
  }

  /**
   * Resource member data structure
   */
  export interface ResourceMember {
    'rdf:about'?: string;
    'rdf:resource'?: string;
    href?: string;
    [key: string]: any;
  }

  /**
   * ResourceSet JSON structure
   */
  export interface ResourceSetJSON {
    'rdfs:member'?: ResourceMember[];
    member?: ResourceMember[];
    [key: string]: any;
  }

  /**
   * Main Maximo API class
   */
  export default class Maximo {
    /**
     * Creates a new Maximo instance
     * @param options - Connection configuration options
     * @param cookie - Optional authentication cookie for session reuse
     * @param callback - Optional callback function
     */
    constructor(options: MaximoOptions, cookie?: AuthCookie, callback?: (error: Error | null) => void);

    protocol: string;
    hostname: string;
    port: string | number;
    user: string;
    password: string;
    islean: number;
    tenantcode?: string;
    auth_scheme: string;
    authType?: string;
    cookie?: AuthCookie;
    isCookieSet: boolean;

    /**
     * Authenticate with Maximo server
     * @returns Promise that resolves with authentication cookie
     */
    authenticate(): Promise<AuthCookie>;

    /**
     * Create a ResourceSet for querying a specific Maximo object
     * @param mbo - Maximo Business Object name (e.g., 'MXWODETAIL', 'MXASSET')
     * @returns ResourceSet instance for building queries
     */
    resourceobject(mbo: string): ResourceSet;

    /**
     * Get the public URI
     * @returns Hostname
     */
    publicuri(): string;
  }

  /**
   * ResourceSet class for building and executing queries
   */
  export class ResourceSet {
    /**
     * Select specific fields to retrieve
     * @param fields - Array of field names
     * @returns this for chaining
     */
    select(fields: string[]): this;

    /**
     * Begin a where clause
     * @param fieldName - Field name to filter on
     * @returns this for chaining
     */
    where(fieldName: string): this;

    /**
     * Add an AND condition to the where clause
     * @param fieldName - Field name for additional condition
     * @returns this for chaining
     */
    and(fieldName: string): this;

    /**
     * Filter by equality
     * @param value - Value to match
     * @returns this for chaining
     */
    equal(value: string | number): this;

    /**
     * Filter by membership in array
     * @param values - Array of values to match
     * @param isInt - Whether values are integers (optional)
     * @returns this for chaining
     */
    in(values: Array<string | number>, isInt?: boolean): this;

    /**
     * Filter for non-null values
     * @returns this for chaining
     */
    notnull(): this;

    /**
     * Order results
     * @param fieldName - Field to order by
     * @param direction - 'asc' or 'desc' (default: 'asc')
     * @returns this for chaining
     */
    orderby(fieldName: string, direction?: 'asc' | 'desc'): this;

    /**
     * Set page size for pagination
     * @param size - Number of records per page
     * @returns this for chaining
     */
    pagesize(size: number): this;

    /**
     * Execute the query and fetch results
     * @returns Promise that resolves with ResourceSet containing results
     */
    fetch(): Promise<ResourceSet>;

    /**
     * Get the next page of results
     * @param resourceSetJson - Previous ResourceSet JSON
     * @returns Promise that resolves with next ResourceSet
     */
    nextpage(resourceSetJson: ResourceSetJSON): Promise<ResourceSet | null>;

    /**
     * Get a specific resource from the set
     * @param index - Index of resource (number) or URI (string)
     * @returns Resource instance
     */
    resource(index: number | string): Resource;

    /**
     * Get the resource set members
     * @returns Array of resource members
     */
    thisResourceSet(): ResourceMember[];

    /**
     * Get or set the complete JSON structure
     * @param resourceSetJson - Optional ResourceSet to set
     * @returns Complete ResourceSet JSON
     */
    JSON(resourceSetJson?: ResourceSetJSON): ResourceSetJSON;

    /**
     * Get the size of the resource set
     * @returns Number of resources in set
     */
    size(): number;

    /**
     * Create a new resource
     * @param data - Data for new resource
     * @param properties - Properties to return
     * @param attachments - Optional attachments
     * @param callback - Optional callback
     * @returns Promise that resolves with created Resource
     */
    create(
      data: Record<string, any>,
      properties?: string[],
      attachments?: any,
      callback?: (statusCode: number, resource: Resource, resourceSet: ResourceSet) => void
    ): Promise<Resource>;

    /**
     * Set action for invoke
     * @param action - Action name
     * @returns this for chaining
     */
    action(action: string): this;

    /**
     * Invoke an action on a resource
     * @param resource - Resource data with action details
     * @param callback - Optional callback
     * @returns Promise
     */
    invoke(
      resource: { url: string; status?: string; memo?: string; action?: string },
      callback?: (statusCode: number, data: any, resourceSet: ResourceSet) => void
    ): Promise<any>;

    /**
     * Get schema for the object
     * @param callback - Optional callback
     * @returns Promise with schema
     */
    schema(callback?: any): Promise<any>;

    /**
     * Get schema with related objects
     * @param callback - Optional callback
     * @returns Promise with schema
     */
    schemarelated(callback?: any): Promise<any>;

    /**
     * Create external connector
     * @param options - Options
     * @returns ExternalConnector instance
     */
    externalConnector(options: any): any;
  }

  /**
   * Individual Resource class
   */
  export class Resource {
    /**
     * Get resource as JSON
     * @returns Resource data
     */
    JSON(): ResourceMember;

    /**
     * Update the resource
     * @param data - Update data
     * @param properties - Properties to return
     * @param callback - Optional callback
     * @returns Promise that resolves with updated Resource
     */
    update(
      data: Record<string, any>,
      properties?: string[],
      callback?: (statusCode: number, resource: Resource, current: Resource) => void
    ): Promise<Resource>;

    /**
     * Delete the resource
     * @param data - Delete data (optional)
     * @param properties - Properties to return
     * @param callback - Optional callback
     * @returns Promise
     */
    delete(
      data?: Record<string, any>,
      properties?: string[],
      callback?: (statusCode: number, resource: Resource, current: Resource) => void
    ): Promise<Resource>;

    /**
     * Merge the resource
     * @param data - Merge data
     * @param properties - Properties to return
     * @param callback - Optional callback
     * @returns Promise
     */
    merge(
      data: Record<string, any>,
      properties?: string[],
      callback?: any
    ): Promise<Resource>;

    /**
     * Fetch the resource
     * @param callback - Optional callback
     * @returns Promise that resolves with Resource
     */
    fetch(callback?: any): Promise<Resource>;

    /**
     * Get a related resource
     * @param relationName - Name of the relation (e.g., 'spi:assetnum')
     * @returns this for chaining
     */
    relatedResource(relationName: string): this;

    /**
     * Specify properties to retrieve for related resource
     * @param properties - Array of property names
     * @returns this for chaining
     */
    properties(properties: string[]): this;

    /**
     * Create an attachment for this resource
     * @param meta - Attachment metadata
     * @param callback - Optional callback
     * @returns Attachment instance
     */
    attachment(meta: AttachmentMeta, callback?: any): Attachment;

    /**
     * Set authentication cookie
     * @param cookie - Authentication cookie
     */
    setcookie(cookie: string[] | AuthCookie): void;
  }

  /**
   * Attachment class for managing file attachments
   */
  export class Attachment {
    /**
     * Get attachment as JSON
     * @returns Attachment data
     */
    JSON(): ResourceMember;

    /**
     * Create/upload the attachment
     * @param buffer - File buffer
     * @param callback - Optional callback
     * @returns Promise that resolves with Resource
     */
    create(
      buffer: Buffer,
      callback?: (statusCode: number, resource: Resource, attachment: Attachment) => void
    ): Promise<Resource>;
  }
}
