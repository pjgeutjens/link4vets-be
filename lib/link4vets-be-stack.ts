import * as cdk from '@aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { Networking } from './networking'
import { DocumentManagementAPI } from './api';
import { FargateCluster } from './fargate'
import { Tags } from '@aws-cdk/core';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as path from 'path';
import { Domain } from './domain';


export class Link4VetsBeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'DocumentsBucket', {
      encryption: BucketEncryption.S3_MANAGED
    });

    new s3Deploy.BucketDeployment(this, 'DocumentsDeployment', {
      sources: [
        s3Deploy.Source.asset(path.join(__dirname, '..', 'documents'))
      ],
      destinationBucket: bucket,
      memoryLimit: 512
    });

    new cdk.CfnOutput(this, 'ImagesBucketNameExport', {
      value: bucket.bucketName,
      exportName: 'ImagesBucketName'
    });

    const networkingStack = new Networking(this, 'NetworkingConstruct', {
      mazAzs: 2
    })

    Tags.of(networkingStack).add('Module', 'Networking')

    // const api = new DocumentManagementAPI(this, 'DocumentManagementApi', {
    //   documentBucket: bucket
    // });

    // Tags.of(api).add('Module', 'API')

    const sampleApp = new FargateCluster(this, 'Fargate', {
      vpc: networkingStack.vpc,
    })

    Tags.of(sampleApp).add('Module', 'SampleApp')

  }
}
