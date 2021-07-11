import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as apig from '@aws-cdk/aws-apigatewayv2';
import { HostedZone } from '@aws-cdk/aws-route53';
import { FargateService } from '@aws-cdk/aws-ecs';




interface FargateClusterProps {
  vpc: ec2.IVpc
}

export class FargateCluster extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: FargateClusterProps) {
      super(scope, id);

      const authApp = new DockerImageAsset(this, 'Auth', {
        directory: path.join(__dirname, '..', 'containers', 'auth-link4vets-be'),

      });

      const landingApp = new DockerImageAsset(this, 'Landing', {
        directory: path.join(__dirname, '..', 'containers', 'landing'),
      });

      const sampleApp = new DockerImageAsset(this, 'Sample', {
        directory: path.join(__dirname, '..', 'containers', 'sample1'),
      });

      const zone = new HostedZone(this, "link4vetsportal", {
        zoneName: "link4vetsportal.be",
      })

      const commonEnvironment = {
        APP_ENVIRONMENT: `env-auth-dev`,
        REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID:"eu-central-1:3916df2b-0640-45b9-95e7-f58c7a8f7777",
        REACT_APP_AWS_COGNITO_REGION:"eu-central-1",
        REACT_APP_AWS_PROJECT_REGION:"eu-central-1",
        REACT_APP_AWS_USER_POOLS_ID:"eu-central-1_9RFaWebkP",
        REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID:"46fe5t3p73fphf6dm72kkqsv78",
        REACT_APP_AWS_COGNITO_COOKIE_DOMAIN:"link4vetsportal.be",
        REACT_APP_AWS_COGNITO_COOKIE_SECURE:"true",
        REACT_APP_AWS_COGNITO_COOKIE_PATH:"/",
        REACT_APP_AWS_COGNITO_COOKIE_EXPIRES:"7"
      }


      const fargateService = new ecsp.ApplicationLoadBalancedFargateService(this, 'AuthService', {
        vpc: props.vpc,
        assignPublicIp: true,
        domainName: "auth.link4vetsportal.be",     
        domainZone: zone,
        serviceName: 'link4vets-auth',
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(authApp),
          environment: commonEnvironment,
          containerPort: 80,
        }

      });

      const landingServiceTask = new ecs.FargateTaskDefinition(this, 'landingServiceTask')
      const landingContainer = landingServiceTask.addContainer('landingServiceContainer', {
        image: ecs.ContainerImage.fromDockerImageAsset(landingApp),
        environment: commonEnvironment,
      })
      landingContainer.addPortMappings({containerPort: 80})

      const landingService = new FargateService(this, 'LandingService', {
        serviceName: 'link4vets-landing',
        cluster: fargateService.cluster,
        taskDefinition: landingServiceTask,
        desiredCount: 1
      })

      landingService.connections.allowFrom(fargateService.loadBalancer, ec2.Port.tcp(80))
      fargateService.loadBalancer.connections.allowTo(landingService, ec2.Port.tcp(80))

      const landingTargetGroup = new elbv2.ApplicationTargetGroup(this, "landingServiceTargetGroup", {
        targets: [landingService],
        protocol: elbv2.ApplicationProtocol.HTTP,
        vpc: props.vpc,
      });

      fargateService.listener.addTargetGroups('landingTargetGroup', {
        targetGroups: [landingTargetGroup],
        hostHeader: "landing.link4vetsportal.be",
        priority: 100
    })


      new cdk.CfnOutput(this, 'SampleAppHost', {
        value: fargateService.loadBalancer.loadBalancerDnsName,
        exportName: 'SampleAppHost'
      });
      
  }
}