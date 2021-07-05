import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import * as ecs from '@aws-cdk/aws-ecs';
import * as apig from '@aws-cdk/aws-apigatewayv2';




interface FargateClusterProps {
  vpc: ec2.IVpc
  api: apig.HttpApi
}

export class FargateCluster extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: FargateClusterProps) {
      super(scope, id);

      const authApp = new DockerImageAsset(this, 'Auth', {
        directory: path.join(__dirname, '..', 'containers', 'auth'),
      });

      const landingApp = new DockerImageAsset(this, 'Landing', {
        directory: path.join(__dirname, '..', 'containers', 'landing'),
      });

      const sampleApp = new DockerImageAsset(this, 'Sample', {
        directory: path.join(__dirname, '..', 'containers', 'sample1'),
      });



      const fargateService = new ecsp.ApplicationLoadBalancedFargateService(this, 'AuthService', {
        vpc: props.vpc,
        
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(authApp),
          environment: {
            APP_ENVIRONMENT: `env-auth-dev`,
            REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID:"eu-central-1:3ad20eb0-5cf5-4fc2-a5fc-a535801d8140",
            REACT_APP_AWS_COGNITO_REGION:"eu-central-1",
            REACT_APP_AWS_PROJECT_REGION:"eu-central-1",
            REACT_APP_AWS_USER_POOLS_ID:"eu-central-1_9RFaWebkP",
            REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID:"46fe5t3p73fphf6dm72kkqsv78",
            REACT_APP_AWS_COGNITO_COOKIE_DOMAIN:"link4vetsportal.be",
            REACT_APP_AWS_COGNITO_COOKIE_SECURE:"true",
            REACT_APP_AWS_COGNITO_COOKIE_PATH:"/",
            REACT_APP_AWS_COGNITO_COOKIE_EXPIRES:"7"
          },
          containerPort: 80,
        }

      });

      new cdk.CfnOutput(this, 'SampleAppHost', {
        value: fargateService.loadBalancer.loadBalancerDnsName,
        exportName: 'SampleAppHost'
      });
      
  }
}