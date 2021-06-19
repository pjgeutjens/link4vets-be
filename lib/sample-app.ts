import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import * as ecs from '@aws-cdk/aws-ecs';
import * as apig from '@aws-cdk/aws-apigatewayv2';
import { platform } from 'os';




interface SampleAppProps {
  vpc: ec2.IVpc
  api: apig.HttpApi
}

export class SampleApp extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: SampleAppProps) {
      super(scope, id);

      const sampleAppDocker = new DockerImageAsset(this, 'SampleAppDockerAsset', {
        directory: path.join(__dirname, '..', 'containers', 'sample'),
        
      });

      const fargateService = new ecsp.ApplicationLoadBalancedFargateService(this, 'SampleAppService', {
        vpc: props.vpc,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(sampleAppDocker),
          environment: {
            SERVER_PORT: "80",
            API_BASE: props.api.url!
          },
          containerPort: 80
        }
      });

      new cdk.CfnOutput(this, 'SampleAppHost', {
        value: fargateService.loadBalancer.loadBalancerDnsName,
        exportName: 'SampleAppHost'
      });
      
  }
}