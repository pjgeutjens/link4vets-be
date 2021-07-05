import * as cdk from '@aws-cdk/core';
import * as cm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IHostedZone } from '@aws-cdk/aws-route53';



interface DomainProps {
  domainName: string
  domainCertificateArn: string
}

export class Domain extends cdk.Construct {

  public readonly certificate: ICertificate
  public readonly zone: IHostedZone

  constructor(scope: cdk.Construct, id: string, props: DomainProps) {
      super(scope, id);

      this.certificate = cm.Certificate.fromCertificateArn(this, 'Certificate', props.domainCertificateArn)
      this.zone = route53.HostedZone.fromLookup(this, 'Route53Zone', {
        domainName: props.domainName
      })
  }
}