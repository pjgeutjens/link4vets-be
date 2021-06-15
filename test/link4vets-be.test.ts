import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Link4VetsBe from '../lib/link4vets-be-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Link4VetsBe.Link4VetsBeStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
