import * as cdk from "aws-cdk-lib"
import {
  aws_route53 as route53,
  aws_certificatemanager as acm,
} from "aws-cdk-lib"

/**
 * サブドメイン用のSSL署名書を発行する。
 */
export class TranscriptionAcmStack extends cdk.Stack {
  public readonly certificate: acm.Certificate
  constructor(
    scope: cdk.App,
    id: string,
    domain: string,
    subDomain: string,
    hostZoneId: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    // Route 53 DNS Zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "GetHostedZone",
      {
        hostedZoneId: hostZoneId,
        zoneName: domain, // Your domain name
      }
    )

    // Create an SSL certificate in ACM
    this.certificate = new acm.Certificate(this, "CreateCertificate", {
      domainName: subDomain, // Your subdomain name
      validation: acm.CertificateValidation.fromDns(hostedZone), // Validate using DNS records
    })
  }
}
